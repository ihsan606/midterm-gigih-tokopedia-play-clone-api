const puppeteer = require('puppeteer');
import { Browser } from 'puppeteer';
import { TokpedResponse } from '../interfaces/TokpedRespose';

// const url = 'https://www.tokopedia.com/hanriverofficial/han-river-rice-cooker-hrrc03-magic-com-portable-travel-version-studen-hijau?src=topads';
export const scrapeProductFromTokped = async (url: string): Promise<TokpedResponse>=> {

  const browser: Browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36');

  try {
    await page.goto(url, { timeout: 60000, waitUntil: 'domcontentloaded' });
  } catch (err) {
    if (err instanceof puppeteer.errors.TimeoutError) {
      console.log('Timeout occurred. Retrying...');
      await page.reload({ waitUntil: 'domcontentloaded' });
    } else {
      console.error('Error occurred:', err);
    }
  }

  const data = await page.evaluate(() => {
    const productTitle = document.querySelector('h2[data-unify="Typography"]')?.textContent;
    const productImage = document.querySelector('img[data-testid="PDPMainImage"]')?.getAttribute('src');
    const productPrice = document.querySelector('div[data-testid="lblPDPDetailProductPrice"]')?.textContent;
    const productDiscount = document.querySelector('span[data-testid="lblPDPDetailDiscountPercentage"]')?.textContent;
    const productOriginalPrice = document.querySelector('span[data-testid="lblPDPDetailOriginalPrice"]')?.textContent;
    const productRating = document.querySelector('span[data-testid="lblPDPDetailProductRatingNumber"]')?.textContent;

    return {
      title: productTitle,
      imageUrl: productImage,
      price: productPrice ? Number(productPrice.replace('Rp', '').replace('.', '')) : null,
      originalPrice: productOriginalPrice ? Number(productOriginalPrice.replace('Rp', '').replace('.', '')) : null,
      discount: productDiscount ? Number(productDiscount.replace('%', '')) : null,
      rating: productRating,
    };
  });

  

  await browser.close();
  return data;
};