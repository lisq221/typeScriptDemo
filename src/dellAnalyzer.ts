//文件分析类
import fs from "fs";
import cheerio from "cheerio";
import Analyze from "./crowller";

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

export default class DellAnalyzer implements Analyze {
  //提取html中需要的数据
  private getCurseInfo(html: string) {
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

  //将数据生成JSON格式
  private generateJSONContent(courseInfo: courseResult, filePath: string) {
    let fileContent: Content = {};
    //先读
    if (fs.existsSync(filePath)) {
      fileContent = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    }
    fileContent[courseInfo.time] = courseInfo.data;
    return fileContent;
  }

  public analyze(html: string, filePath: string) {
    const courseInfo = this.getCurseInfo(html);
    const fileContent = this.generateJSONContent(courseInfo, filePath);
    return JSON.stringify(fileContent);
  }
}
