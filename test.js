function transform(url) {
    url.replace(/.+\?/, '')
}

transform('http://www.aaa.com?a=1&b=2&c=3');