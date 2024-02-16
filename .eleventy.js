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


    const markdownLib = markdownIt({html: true, highlight: function (str, lang) {return ''}}).use(markdownItAnchor, {
        permalink: markdownItAnchor.permalink.linkInsideHeader({
            symbol: '<span class="heading-anchor" aria-hidden="true">¶</span>',
            placement: 'after'
          })
    });
    eleventyConfig.setLibrary("md", markdownLib);

    eleventyConfig.addFilter("sortDataByTime", (obj) => {
        const sorted = {};
        Object.keys(obj)
          .sort((a, b) => {
                let atime = obj[a].time.split("-")[0].split(":").map(Number)
                let btime = obj[b].time.split("-")[0].split(":").map(Number)
                return new Date(2024, 2, 15, atime[0], atime[1], 0) > new Date(2024, 2, 15, btime[0], btime[1], 0) ? 1 : -1;
           }).forEach((name) => (sorted[name] = obj[name]));
        return sorted;
    });
    eleventyConfig.addFilter("countSession", (obj) => {
        if ( obj.panelists || obj.talks.length == 0 ) { return ""; }
        var count = {"lt": 0, "normal": 0};
        obj.talks.forEach((talk) => { count[talk.type] += 1; });
        return "[" + `一般発表${count["normal"]}件` + ((count["lt"] > 0) ? `・LT${count["lt"]}件` : "") + "]";
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
