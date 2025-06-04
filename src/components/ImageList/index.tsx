import React from 'react';
import { Image, List } from 'antd';
import styles from './index.module.less';

interface ImageListProps {
  images: string;
}

const ImageList: React.FC<ImageListProps> = ({ images }) => {
  const imageArray = images?.split(',')?.filter(Boolean) ?? [];
  if (imageArray.length === 0) {
    return null;
  }

  return (
    <List
      grid={{
        gutter: 16
      }}
      dataSource={imageArray}
      renderItem={(image, index) => (
        <List.Item style={{ width: 100, height: 100 }}>
          <Image
            width={100}
            height={100}
            src={image}
            alt={`图片 ${index + 1}`}
            className={styles.image}
            preview={{
              mask: '点击预览',
            }}
          />
        </List.Item>
      )}
    />
  );
};

export default ImageList;
