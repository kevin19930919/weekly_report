import smtplib
import mimetypes
from email import encoders
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email.mime.text import MIMEText
from dataclasses import dataclass
import os

REPORTROOTDIR = "/data2/weekly_report"

# ====== utility functions =======
def construct_full_file_path(filename):
    return os.path.join(REPORTROOTDIR, filename)

class MailHandler():
    sender = "kevin19930919@gmail.com"
    _user_name = "kevin19930919@gmail.com"
    _password = "qjhuqjoqsvettkqj"

    def __init__(self, receiver_email):
        self.receiver = receiver_email
    
    @property
    def receiver(self):
        return self._receiver

    @receiver.setter
    def receiver(self, new_receiver):
        self._receiver = new_receiver

    def construct_mail_contents(self):
        #initial multipurpose internet mail extension
        mail_contents = MIMEMultipart()
        mail_contents["From"] = self.sender
        mail_contents["To"] = self._receiver
        mail_contents["Subject"] = "weekly report KevinTsai"
        content = """
        Dear Frank:
            weekly report is in email attachment.

        Best regards,
        Kevin Tsai
        """
        mail_contents.attach(MIMEText(content))
        return mail_contents

    def send_report(self, filename):
        msg = self.construct_mail_contents()
        full_file_path = construct_full_file_path(filename)
        ctype, encoding = self.define_file_type(full_file_path)
        maintype, subtype = ctype.split("/", 1)
        attachment = self.encode_mime_file(full_file_path, maintype, subtype)
        attachment.add_header("Content-Disposition", "attachment", filename=filename.split('/')[-1])
        msg.attach(attachment)
        try:
            with smtplib.SMTP_SSL(host="smtp.gmail.com", port="465") as server: 
                print("login mail server........")
                server.login(self._user_name, self._password)
                print('sending mail')
                server.sendmail(self.sender, self._receiver, msg.as_string())
                print('sending mail success')
        except Exception as e:
            print(e)
        
    #define file type
    @classmethod
    def define_file_type(cls, file_path):
        ctype, encoding = mimetypes.guess_type(file_path)
        if not ctype or not encoding:
            ctype = "application/octet-stream"
        return ctype, encoding
    
    @classmethod
    def encode_mime_file(cls, file_path, maintype, subtype):
        with open(file_path, "rb") as fp:
            attachment = MIMEBase(maintype, subtype)
            attachment.set_payload(fp.read())
        encoders.encode_base64(attachment)
        return attachment 
        

