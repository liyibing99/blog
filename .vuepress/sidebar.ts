import {SidebarConfig4Multiple} from "vuepress/config";

import roadmapSideBar from "./sidebars/roadmapSideBar";
import workSideBar from "./sidebars/workSideBar";
// @ts-ignore
export default {
    "/学习路线/": roadmapSideBar,
    "/工作思考及感悟/": workSideBar,
    // 降级，默认根据文章标题渲染侧边栏
    "/": "auto",
} as SidebarConfig4Multiple;
