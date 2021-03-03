//ts->.d.ts 翻译文件->js
import superagent from "superagent";

//创建爬虫类
class Crowller {
  private secret = "x3b174jsx";

  private url = `http://www.dell-lee.com/typescript/demo.html?secret=${this.secret}`;

  private rawHtml = "";

  async getRawHtml() {
    const res = await superagent.get(this.url);
    this.rawHtml = res.text;
  }
  constructor() {
    this.getRawHtml();
  }
}

//创建爬虫类实例
const crowller = new Crowller();
