# from gevent import monkey
# monkey.patch_all()
import uvicorn
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from elasticsearch import Elasticsearch

# ==========initial app=============
app = FastAPI()
app.mount("/static", StaticFiles(directory="./fastapi/static"), name="static")

# ========app configure=============
#TODO
# =========regiter router===========
#TODO
import sys
sys.path.append('./fastapi')
from api import cryptoAPI
from view import cryptoView
app.include_router(cryptoAPI.cryptoAPIRouter)
app.include_router(cryptoView.CryptoTradeListRouter)



if __name__ == "__main__":
    uvicorn.run("run:app", host="0.0.0.0", port=5000)
