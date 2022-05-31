from fastapi import FastAPI, Request, APIRouter
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

templates = Jinja2Templates(directory="./fastapi/templates")

LoginViewer = APIRouter()

@LoginViewer.get("/", response_class=HTMLResponse)
async def render_login_page(request: Request):
    return templates.TemplateResponse("login.html",{"request": request})