
const canvas = document.getElementById('canvas-2d');
const context = canvas.getContext('2d');

export class Utils {

    static clearDisplay() {
        // 指定範囲をクリア
        context.clearRect(0, 0, canvas.width, canvas.height);
        // 枠線の太さ
        context.lineWidth = 10;
        // 現在のパスをリセット
        context.beginPath();
        context.rect(0, 0, canvas.width, canvas.height);
        context.stroke();
    }
}