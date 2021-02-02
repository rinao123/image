export interface Color {
    red: number;
    green: number;
    blue: number;
    alpha: number;
}

export class HistogramData {
    private _red: Map<number, number>;
    private _green: Map<number, number>;
    private _blue: Map<number, number>;

    constructor() {
        this._red = new Map<number, number>();
        this._green = new Map<number, number>();
        this._blue = new Map<number, number>();
        for (let i = 0; i <= 255; i++) {
            this._red.set(i, 0);
            this._green.set(i, 0);
            this._blue.set(i, 0);
        }
    }

    get red() {
        return this._red;
    }

    set red(red: Map<number, number>) {
        this._red = red;
    }

    get green() {
        return this._green;
    }

    set green(green: Map<number, number>) {
        this._green = green;
    }

    get blue() {
        return this._blue;
    }

    set blue(blue: Map<number, number>) {
        this._blue = blue;
    }

    static fromImageData = (imageData: ImageData): HistogramData => {
        const histogramData: HistogramData = new HistogramData();
        const dataArray = imageData.data;
        for (let i = 0; i < dataArray.length; i += 4) {
            const red = dataArray[i];
            const green = dataArray[i + 1];
            const blue = dataArray[i + 2];
            const redValue = histogramData.red.get(red) as number;
            histogramData.red.set(red, redValue + 1);
            const greenValue = histogramData.green.get(green) as number;
            histogramData.green.set(green, greenValue + 1);
            const blueValue = histogramData.blue.get(blue) as number;
            histogramData.blue.set(blue, blueValue + 1);
        }
        return histogramData;
    }
}

export default class ImageUtil {
    static fileToBase64 = async (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event: ProgressEvent<FileReader>) => {
                const base64: string = (event.target?.result || "") as string;
                resolve(base64);
            }
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    static getImageData = async (url: string): Promise<ImageData> => {
        try {
            const image = await ImageUtil.getImageElement(url);
            return new Promise((resolve, reject) => {
                const canvas = document.createElement("canvas");
                canvas.width = image.width;
                canvas.height = image.height;
                const context = canvas.getContext("2d");
                if (!context) {
                    reject("context is null");
                    return;
                }
                context.drawImage(image, 0, 0, image.width, image.height);
                const imageData = context.getImageData(0, 0, image.width, image.height);
                resolve(imageData);
            });
        } catch (error) {
            return Promise.reject(error);
        }
    }

    static getImageElement = async (url: string): Promise<HTMLImageElement> => {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.setAttribute("crossOrigin", "anonymous");
            image.src = url;
            image.onload = () => {
                resolve(image);
            }
            image.onerror = reject;
        });
    }

    static getImageThemeColor = (imageData: ImageData): Color => {
        const dataArray = imageData.data;
        let red = 0;
        let green = 0;
        let blue = 0;
        let alpha = 0;
        for (let i = 0; i < dataArray.length; i += 4) {
            red += dataArray[i];
            green += dataArray[i + 1];
            blue += dataArray[i + 2];
            alpha += dataArray[i + 3];
        }
        const pointCount = dataArray.length / 4;
        const color = { 
            red: red / pointCount, 
            green: green / pointCount, 
            blue: blue / pointCount, 
            alpha: alpha / pointCount 
        };
        return color;
    }
}