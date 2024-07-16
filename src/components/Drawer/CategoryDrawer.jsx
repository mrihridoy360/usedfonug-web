'use client'
import { Drawer, Tree } from "antd"
import { MdClose } from "react-icons/md"
import { useEffect, useState } from 'react';
import Link from "next/link";
import { TiArrowSortedDown } from "react-icons/ti";

const CategoryDrawer = ({ IsBuySellDrawerOpen, OnHide, Category }) => {

    const [treeData, setTreeData] = useState([]);

    useEffect(() => {
        if (Category) {
            setTreeData(constructTreeData(Category));
        }
    }, [Category]);

    const constructTreeData = (category) => {
        return category?.subcategories?.map((subcat) => ({
            title: subcat.translated_name,
            key: subcat.id,
            children: subcat?.subcategories?.length > 0 ? constructTreeData(subcat) : null,
        }));
    };

    const renderTreeNode = (node) => {
        return (
            node.children ? (
                <span style={{ display: 'flex', alignItems: 'center' }}>{node.title}<TiArrowSortedDown size={20} /></span>
            ) : (
                <Link href={`/category/${node.key}`}>
                    {node.title}
                </Link>
            )
        );
    };

    const CloseIcon = <div className="close_icon_cont"><MdClose size={24} color="black" /></div>

    return (
        <Drawer className='category_drawer' title={Category?.translated_name} onClose={OnHide} open={IsBuySellDrawerOpen} closeIcon={CloseIcon} placement="left" >
            <Tree treeData={treeData} selectable={false} titleRender={renderTreeNode} className="catTree" />
        </Drawer>
    )
}

export default CategoryDrawer