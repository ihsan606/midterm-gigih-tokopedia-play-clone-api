import axios from 'axios';
import cheerio from 'cheerio';



export const scrapeProducts = async (url: string)=> {
  try {
    const response = await axios.get(url);
    const html = response.data;

    const $ = cheerio.load(html);
    const ratingElement = $('span[data-testid="lblPDPDetailProductRatingNumber"]');

    const productTitle = $('h1[data-testid="lblPDPDetailProductName"]').text();
    const productImage = $('img[data-testid="PDPMainImage"]').attr('src');
    const productPrice = $('div[data-testid="lblPDPDetailProductPrice"]').text();
    const productDiscount = $('span[data-testid="lblPDPDetailDiscountPercentage"]').text();
    const productOriginalPrice = $('span[data-testid="lblPDPDetailOriginalPrice"]').text();

    console.log(ratingElement);
    const rating = ratingElement.text();
    console.log(parseFloat(rating));
    const data = {
      title: productTitle,
      imageUrl: productImage,
      price: productPrice ? Number(productPrice.replace('Rp', '').replace('.', '')) : null,
      originalPrice: productOriginalPrice ? Number(productOriginalPrice.replace('Rp', '').replace('.', '')) : null,
      discount: productDiscount ? Number(productDiscount.replace('%', '')) : null,
    };
    return data;

  } catch (error) {
    console.log(error);
    
  }
};