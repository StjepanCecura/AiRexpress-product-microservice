const ContentfulClient = require("../utils/contentful");

module.exports = async (req, res) => {
  const contentfulClientInstance = new ContentfulClient();
  const client = contentfulClientInstance.getClient();
  const slug = req.query.slug;
  client
    .getEntries({
      content_type: "page",
      "fields.slug": slug,
    })
    .then((response) => {
      let markdownDescription = response.items[0].fields.description;
      const htmlDesciption = markdownToHtml(markdownDescription);
      const longText = markdownToHtml(
        response.items[0].fields.footer.fields.longText
      );
      const carousel = response.items[0].fields.carousel.fields;
      const carouselImages = [];
      carousel.images.map((image) => {
        carouselImages.push({
          title: image.fields.title,
          description: image.fields.description,
          url: image.fields.file.url,
        });
      });

      let tag = response.items[0].fields.tag;
      let category = response.items[0].fields.category;

      const modifiedResponse = {
        title: response.items[0].fields.title,
        slug: response.items[0].fields.slug,
        type:
          category != undefined
            ? "category"
            : tag != undefined
            ? "tag"
            : "none",
        tag: response.items[0].fields.tag ?? "none",
        category: response.items[0].fields.category ?? "none",
        description: htmlDesciption,
        header: {
          title: response.items[0].fields.header.fields.title,
          description: response.items[0].fields.header.fields.shortDescription,
          image: {
            title: response.items[0].fields.header.fields.image.fields.title,
            description:
              response.items[0].fields.header.fields.image.fields.description,
            url: response.items[0].fields.header.fields.image.fields.file.url,
          },
        },
        footer: {
          email: response.items[0].fields.footer.fields.email,
          phoneNumber: response.items[0].fields.footer.fields.phoneNumber,
          longText: longText,
          image: {
            title:
              response.items[0].fields.footer.fields.footerImage.fields.title,
            description:
              response.items[0].fields.footer.fields.footerImage.description,
            url: response.items[0].fields.footer.fields.footerImage.fields.file
              .url,
          },
        },
        carousel: {
          images: carouselImages,
        },
      };
      res.status(200).send(modifiedResponse);
    })
    .catch((error) => {
      console.log("Error occurred while fetching products:", error);
      res.status(400).send(error);
    });
};

const markdownToHtml = (markdownDescription) => {
  let htmlDesciption = markdownDescription;
  const newLineRegex = /\n/g;
  const boldRegex = /__(.*?)__/g;
  const imageRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  htmlDesciption = htmlDesciption.replace(newLineRegex, "<br/>");
  htmlDesciption = htmlDesciption.replace(boldRegex, "<strong>$1</strong>");
  htmlDesciption = htmlDesciption.replace(imageRegex, '<a href="$2">$1</a>');

  return htmlDesciption;
};
