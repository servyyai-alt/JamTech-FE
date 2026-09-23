
from PIL import Image
import sys

def make_white_transparent(img_path):
    img = Image.open(img_path)
    img = img.convert('RGBA')
    datas = img.getdata()
    
    newData = []
    # threshold for white
    for item in datas:
        if item[0] > 230 and item[1] > 230 and item[2] > 230:
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)
            
    img.putdata(newData)
    img.save(img_path, 'PNG')
    print('Done!')

if __name__ == '__main__':
    make_white_transparent('src/assets/least-action-logo.png')
