from fastapi import FastAPI, Request, APIRouter
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from enum import Enum

class Target(str, Enum):
    ETH = "ETH"
    FTX = "FTX"
    MOVR = "MOVR"
    DOT = "DOT"

templates = Jinja2Templates(directory="./fastapi/templates")

CryptoTradeListRouter = APIRouter(prefix="/Crypto",tags=["Crypto"])

@CryptoTradeListRouter.get("/list", response_class=HTMLResponse)
async def render_crypto(request: Request):
    return templates.TemplateResponse("crypto_trades.html",{"request": request})

@CryptoTradeListRouter.get("/charts", response_class=HTMLResponse)
async def render_crypto_chart(request: Request):
    return templates.TemplateResponse("crypto_charts.html",{"request": request})    

@CryptoTradeListRouter.get("/price-table", response_class=HTMLResponse)
async def render_crypto_chart(request: Request):
    return templates.TemplateResponse("price_list.html",{"request": request})        