const publicPath = './public';

let path = publicPath;

export class HelperFileLoader {
    set path(_path) {
        path = publicPath + _path;
    }

    public customFileName(req, file, cb) {
        const originalName = file.originalname.split('.');
        const fileExtension = originalName[originalName.length - 1];
        cb(null, `${Date.now()}.${fileExtension}`);
    }

    public destinationPath(req, file, cb) {
        cb(null, path);
    }
}