//node方法，判断文件是否存在
import fs from "fs";
import path from "path";
//ts->.d.ts 翻译文件->js
import superagent from "superagent";
import DellAnalyzer from "./dellAnalyzer";

export default interface Analyzer {
  analyze: (html: string, filePath: string) => string;
}

//创建爬虫类，crowller类只关注数据的存、取，数据的分析不关注
class Crowller {
  private filePath = path.resolve(__dirname, "../data/course.json");

  constructor(private analyzer: Analyzer, private url: string) {
    this.initSpiderProcess();
  }

  //主业务逻辑代码
  async initSpiderProcess() {
    const html = await this.getRawHtml();
    const fileContent = this.analyzer.analyze(html, this.filePath);
    this.writeFilePath(fileContent);
  }

  //获取html
  async getRawHtml() {
    const res = await superagent.get(this.url);
    return res.text;
  }

  //写入文件中
  writeFilePath(content: string) {
    fs.writeFileSync(this.filePath, content);
  }
}

const secret = "x3b174jsx";
const url = `http://www.dell-lee.com/typescript/demo.html?secret=${secret}`;
const analyzer = new DellAnalyzer();
//创建爬虫类实例
new Crowller(analyzer, url);
