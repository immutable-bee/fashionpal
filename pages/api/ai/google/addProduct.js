import { vision } from "@google-cloud/vision";

const handler = async (req, res) => {
  const data = req.body();

  const client = new vision.ProductSearchClient();

  const createProduct = async () => {
    /**
     * TODO(developer): Uncomment the following line before running the sample.
     */
    // const projectId = 'Your Google Cloud project Id';
    // const location = 'A compute region name';
    // const productId = 'Id of the product';
    // const productDisplayName = 'Display name of the product';
    // const productCategory = 'Catoegory of the product';

    // Resource path that represents Google Cloud Platform location.
    const locationPath = client.locationPath(projectId, location);

    const product = {
      displayName: data.productDisplayName,
      productCategory: data.productCategory,
    };

    const request = {
      parent: locationPath,
      product: product,
      productId: data.productId,
    };

    const [createdProduct] = await client.createProduct(request);
  };

  await createProduct();

  const addProductToProductSet = async () => {
    /**
     * TODO(developer): Uncomment the following line before running the sample.
     */
    // const projectId = 'Your Google Cloud project Id';
    // const location = 'A compute region name';
    // const productId = 'Id of the product';
    // const productSetId = 'Id of the product set';

    const productPath = client.productPath(projectId, location, productId);
    const productSetPath = client.productSetPath(
      projectId,
      location,
      productSetId
    );

    const request = {
      name: productSetPath,
      product: productPath,
    };

    await client.addProductToProductSet(request);
  };

  addProductToProductSet();
};

export default handler;
