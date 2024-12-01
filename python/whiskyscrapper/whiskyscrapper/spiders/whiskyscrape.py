import scrapy

class WhiskySpider(scrapy.Spider):
    name = "whisky"

    def start_requests(self):
        urls = ['https://in.indeed.com/']
        for url in urls:
            yield scrapy.Request(
                url=url,
                headers={
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36'
                }
            )

    def parse(self, response):
        # Process the response here
        self.log(f"Page title: {response.xpath('//title/text()').get()}")
