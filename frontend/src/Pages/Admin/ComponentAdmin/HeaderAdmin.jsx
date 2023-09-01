import React from 'react'
import {Badge, Image, Space, Typography} from 'antd';
import {BellFilled, MailOutlined} from "@ant-design/icons";


function HeaderAdmin() {
  return (
    <div className="HeaderAdmin">
      <Image width={200} src="/img/logo_main.png"></Image>
      <Typography.Title style={{ marginTop: "15px" }}>
        FastMove Admin DashBoard
      </Typography.Title>
      <Space>
        <Badge count={10} dot>
          <MailOutlined style={{ fontSize: 24 }} />
        </Badge>
        <Badge count={20}>
          <BellFilled style={{ fontSize: 24 }} />
        </Badge>
      </Space>
    </div>
  );
}

export default HeaderAdmin