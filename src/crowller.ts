//node方法，判断文件是否存在
import fs from "fs";
import path from "path";
//ts->.d.ts 翻译文件->js
import superagent from "superagent";
import cheerio from "cheerio";

//创建一个接口
interface Course {
  title: string;
  count: number;
}

interface courseResult {
  time: number;
  data: Course[];
}

interface Content {
  [propName: number]: Course[];
}

//创建爬虫类
class Crowller {
  private secret = "x3b174jsx";

  private url = `http://www.dell-lee.com/typescript/demo.html?secret=${this.secret}`;

  constructor() {
    this.initSpiderProcess();
  }

  //主业务逻辑代码
  async initSpiderProcess() {
    const filePath = path.resolve(__dirname, "../data/course.json");
    const html = await this.getRawHtml();
    const courseInfo = this.getCurseInfo(html);
    const fileContent = this.generateJSONContent(courseInfo);
    fs.writeFileSync(filePath, JSON.stringify(fileContent));
  }

  //获取html
  async getRawHtml() {
    const res = await superagent.get(this.url);
    return res.text;
  }

  //提取html中需要的数据
  getCurseInfo(html: string) {
    const $ = cheerio.load(html);
    const courseItems = $(".course-item");
    let courseInfos: Course[] = [];
    courseItems.map((index, element) => {
      const descs = $(element).find(".course-desc");
      const title = descs.eq(0).text();
      const count = parseInt(descs.eq(1).text().split("：")[1], 10);
      courseInfos.push({ title, count });
    });
    const result = {
      time: new Date().getTime(),
      data: courseInfos
    };
    return result;
  }

  //将数据生成JSON文件
  generateJSONContent(courseInfo: courseResult) {
    const filePath = path.resolve(__dirname, "../data/course.json");
    let fileContent: Content = {};
    //先读
    if (fs.existsSync(filePath)) {
      fileContent = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    }
    fileContent[courseInfo.time] = courseInfo.data;
    return fileContent;
  }
}

//创建爬虫类实例
const crowller = new Crowller();
