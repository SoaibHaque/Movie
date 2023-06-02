const axios = require('axios');
const htmlParser = require('node-html-parser');

const fn_scrapping = {
    values: {
        domain: '111.90.159.159',
        cardArr: []
    },
    extractingData: function (ele) {
        let template = {
            videoUrl: null,
            posterUrl: null,
            title: null,
            tags: [],
            rating: null,
            duration: null,
            quality: null,
            category: null
        }
        template.videoUrl = ele.querySelector('.content-thumbnail a').rawAttributes.href;
        template.posterUrl = ele.querySelector('.content-thumbnail a img')?.rawAttributes?.src ?? '../img/bg_2.jpg';
        template.rating = ele?.querySelector('.content-thumbnail .gmr-rating-item')?.innerText?.trim().slice(0, 3) ?? null;
        template.quality = ele?.querySelector('.content-thumbnail .gmr-quality-item')?.innerText?.trim() ?? null;
        template.duration = ele?.querySelector('.content-thumbnail .gmr-duration-item')?.innerText?.trim() ?? null;
        template.category = ele?.querySelector('.content-thumbnail .gmr-posttype-item')?.innerText?.trim() ?? null;
        template.title = ele?.querySelector('.item-article .entry-title a')?.innerText?.trim() ?? null;
        template.tags = [...ele?.querySelectorAll('.item-article .gmr-movie-on a')].map(el => el.innerText.trim());
        fn_scrapping.values.cardArr.push(template);
    },
    parsingDOM: function (domStr) {
        let dom = htmlParser.parse(domStr);
        let articles = dom.querySelector('#gmr-main-load').querySelectorAll('article');
        articles.forEach(this.extractingData);
        return fn_scrapping.values.cardArr;
    },
    searchQuery: async function (query) {
        fn_scrapping.values.cardArr = [];
        let url = `https://${fn_scrapping.values.domain}/?s=${query.replaceAll(/\s/g, '+')}&post_type[]=post`;
        let html = await axios.get(url).then(r => r.data);
        html = html.replaceAll("&#8217;", "'"); // replace other unsupported comma to supported comma
        return fn_scrapping.parsingDOM(html);
    },
    getMoreResults: async function (link) {

    }
}

module.exports = fn_scrapping;