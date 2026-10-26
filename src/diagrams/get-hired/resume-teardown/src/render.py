import asyncio, pathlib, subprocess, json
from playwright.async_api import async_playwright
HERE=pathlib.Path(__file__).parent; OUT=HERE.parent
CHECK="""()=>{
 const pg=document.querySelector('.after-pg'); const res={};
 const last=[...pg.children].pop(); res.afterBottom=last.offsetTop+last.offsetHeight; res.afterLimit=1056-40;
 const pb=document.querySelector('.before-pg'); const lb=[...pb.children].pop(); res.beforeBottom=lb.offsetTop+lb.offsetHeight;
 const c=pg.querySelector('.contact'); res.contactW=c.scrollWidth; res.textW=816-100;
 res.bullets=[...pg.querySelectorAll('li')].map(li=>{const r=document.createRange();r.selectNodeContents(li);
   const rs=[...r.getClientRects()]; const tops=[...new Set(rs.map(x=>Math.round(x.top)))];
   const lr=rs.filter(x=>Math.round(x.top)===tops[tops.length-1]); const right=Math.max(...lr.map(x=>x.right));
   const L=li.getBoundingClientRect(); return [tops.length, +((right-L.left)/L.width).toFixed(2), li.textContent.slice(0,40)]});
 res.lns=[...pg.querySelectorAll('.ln,.sk')].map(e=>{const r=document.createRange();r.selectNodeContents(e);const rs=[...r.getClientRects()];const B=e.getBoundingClientRect();return [Math.round(B.height),+((Math.max(...rs.map(x=>x.right))-B.left)/B.width).toFixed(2),+((rs[rs.length-1].right-B.left)/B.width).toFixed(2),e.textContent.slice(0,25)]});
 return res;}"""
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path="/usr/bin/google-chrome",args=["--no-sandbox"])
        for name,w,dpr in [("before-after",1200,2),("before-after-mobile",390,3),("before-after-dark",1200,2),("before-after-mobile-dark",390,3)]:
            pg=await b.new_page(viewport={"width":w,"height":900},device_scale_factor=dpr)
            await pg.goto(f"file://{HERE}/{name}.html"); await pg.wait_for_selector("body[data-ready]"); await pg.wait_for_timeout(200)
            await pg.screenshot(path=str(OUT/f"{name}.png"),full_page=True)
            if name=="before-after":
                print(json.dumps(await pg.evaluate(CHECK),indent=0))
                h=await pg.evaluate("document.documentElement.scrollHeight")
                await pg.pdf(path=str(HERE/"_tmp.pdf"),width="1200px",height=f"{h+2}px",print_background=True,margin={"top":"0","bottom":"0","left":"0","right":"0"})
            await pg.close()
        await b.close()
    subprocess.run(["pdftocairo","-svg","-f","1","-l","1",str(HERE/"_tmp.pdf"),str(OUT/"before-after.svg")],check=True)
    (HERE/"_tmp.pdf").unlink()
asyncio.run(main())
