export const isProd: boolean = process.env.NODE_ENV === 'production';

export default {
    getAsset: (asset) => isProd ? `${__dirname}/images/${asset}` : `renderer/public/images/${asset}`,
    renderPage: (pageName) => isProd ? `app://./${pageName}.html` : `http://localhost:${process.argv[2]}/${pageName}`
}