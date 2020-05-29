const request = require('requestretry').defaults({fullResponse: false});
const fs = require('fs');
const cheerio = require('cheerio');

const prop24Url = 'https://www.property24.com';
const firstUrlBit = 'https://www.property24.com/to-rent/advanced-search/results/p'
const secondUrlBit = '?sp=s%3d10157%2c10164%2c11741%2c8682%2c8679%2c8669%2c9155%2c9145%2c9143%2c10163%2c10161%2c9166%2c9149%2c9141%2c11017%2c11018%2c11021%2c11016%2c11013%2c11015%2c11014%2c16541%26pf%3d8000%26pt%3d11000%26bth%3d1%26rr%3dMonth&PropertyCategory=House%2cApartmentOrFlat%2cTownhouse';

const results = [];
let nextpage = null;
let index = 1;
let id = 1;


async function getListings() {
  try {
    const html = await request.get(firstUrlBit + index + secondUrlBit);
    const $ = await cheerio.load(html);
    const next = $('.p24_pager').children('.pull-right.text-muted').text().trim();
    if (next === 'Next') {
      nextpage = false;
    } else {
      nextpage = true;
    }

    const listings = $('.p24_regularTile').children();
    
    listings.each((i, item) => {
      id += i;
      const url = prop24Url + item.attribs.href;
      const imageUrl = $(item).find('.js_P24_listingImage').attr('src');
      const title = item.attribs.title;
      const location = $(item).find('.p24_location').text().trim();
      const address = $(item).find('.p24_address').text().trim();
      const price = $(item).find('.p24_price').text().trim();
      const excerpt = $(item).find('.p24_excerpt').text().trim();
      const floorSize = $(item).find('.p24_size').children('span').text().split(' ')[0];
      const features = $(item).find('.p24_featureDetails');
      let bedrooms = '';
      let bathrooms = '';
      let garages = '';
      features.each((r, feature) => {
        let alt = $(feature).attr('title').trim().toString();
        if (alt === 'Bedrooms') {
          bedrooms = $(feature).find('span').text().trim();
        }
        else if (alt === 'Bathrooms') {
          bathrooms = $(feature).find('span').text().trim();
        }
        else if (alt === 'Garages') {
          garages = $(feature).find('span').text().trim();
        }
      })
      const dateNow = new Date();
      let availableDate = $(item).find('.p24_availableBadge').text().split(':')[1];
      if (availableDate) {
        availableDate += dateNow.getFullYear();
        availableDate = new Date(availableDate);
        availableDate = availableDate.toString().split('00')[0].trim();
      }

      let result = {
        id,
        url,
        imageUrl,
        title,
        location,
        address,
        price,
        excerpt,
        availableDate,
        bedrooms,
        bathrooms,
        garages,
        floorSize,
      }

      if ((!floorSize || floorSize >= 45) && bedrooms <= 1) {
        results.push(result);
      };
    });

    index += 1;
  }
  catch(error) {
    console.error(error);
  }
}

async function writeTofile() {
  const prop24Json = JSON.stringify(results, null, '\t');
  fs.writeFile('property24.json', prop24Json, (error) => { 
    if (error) throw error;
    console.log('Results saved!');
  });
}

async function scrapeProperty24() {
  console.log(false, index);
  await getListings();
  while(nextpage) {
    console.log(nextpage, index);
    await getListings();
  }
  await writeTofile();
}

scrapeProperty24();
