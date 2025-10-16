export function getLines(canvas: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  var words = text.split(' ')
  var lines = []
  var currentLine = words[0]!

  for (var i = 1; i < words.length; i++) {
    var word = words[i]!
    var width = canvas.measureText(currentLine + " " + word).width
    if (width < maxWidth) {
      currentLine += ' ' + word
    } else {
      lines.push(currentLine)
      currentLine = word
    }
  }
  lines.push(currentLine)
  return lines
}


export function lerp(
  a: number,
  b: number,
  progress: number,
  t: (progress: number) => number = i => i
): number {
  return a + ((b - a) * t(progress))
}