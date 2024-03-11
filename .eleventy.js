const fs = require("fs");
const path = require("path");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");

module.exports = function(eleventyConfig) {
    eleventyConfig.addPassthroughCopy("./src/css");
    eleventyConfig.addWatchTarget("./src/css");

    eleventyConfig.addPassthroughCopy("./src/js");
    eleventyConfig.addWatchTarget("./src/js");

    eleventyConfig.addPassthroughCopy("./src/img");
    eleventyConfig.addWatchTarget("./src/img");

    eleventyConfig.addPassthroughCopy("./src/materials");
    eleventyConfig.addWatchTarget("./src/materials");


    const markdownLib = markdownIt({html: true}).use(markdownItAnchor, {
        permalink: markdownItAnchor.permalink.linkInsideHeader({
            symbol: '<span class="heading-anchor" aria-hidden="true">¶</span>',
            placement: 'after'
          })
    });
    eleventyConfig.setLibrary("md", markdownLib);

    eleventyConfig.addFilter("sortDataByTime", (obj) => {
        const sorted = {};
        Object.keys(obj).sort((a, b) => {
                let atime = obj[a].time.split("-")[0].split(":").map(Number)
                let btime = obj[b].time.split("-")[0].split(":").map(Number)
                return new Date(2024, 3, 15, atime[0], atime[1], 0) > new Date(2024, 3, 15, btime[0], btime[1], 0) ? 1 : -1;
           }).forEach((name) => (sorted[name] = obj[name]));
        return sorted;
    });
    eleventyConfig.addFilter("countSession", (obj) => {
        if ( obj.panelists || obj.talks.length == 0 ) { return ""; }
        var count = {"lt": 0, "normal": 0, "invite": 0};
        obj.talks.forEach((talk) => { count[talk.type] += 1; });
        return "[" 
        + ((count["invite"] > 0) ? `招待講演・` : "") 
            + `一般発表${count["normal"]}件` + ((count["lt"] > 0) ? `・LT${count["lt"]}件` : "") 
            + "]";
    });
    eleventyConfig.addNunjucksShortcode("pdf", function (talk) {
        const dataFile = path.join("src/materials", `${talk.id}.pdf`);
        if (fs.existsSync(dataFile)) {
            return `<a href="../materials/${talk.id}.pdf" target="_blank" rel="noreferrer"><div class="btn_material">資料</div></a>`;
        } else {
            if (talk.type == "invite") { return `<p>（準備中）</p>`; } else {
                return `<div class="btn_material disabled">資料</div>`;
            }
        }
    });

    return {
        dir: {
            input: "src",
            output: "docs"
        },
        pathPrefix: "/JLR2024/",
        markdownTemplateEngine: "njk"
    }
}
