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

    return {
        dir: {
            input: "src",
            output: "docs"
        },
        pathPrefix: "/JLR2024/"
    }
}
