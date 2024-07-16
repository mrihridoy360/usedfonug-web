import Skeleton, { SkeletonTheme } from "react-loading-skeleton"
import 'react-loading-skeleton/dist/skeleton.css'

const ProductHorizontalCardSkeleton = () => {
    return (
        <div className='product_horizontal_card card'>
            <div className="product_img_div">
                <Skeleton width='100%' className="prodcut_img" />
            </div>
            <div className="product_details">
                <div className="product_featured_header">
                    <div className="w-100">
                        <Skeleton count={0.1} />
                    </div>
                </div>
                <div className="title_details">
                    <Skeleton width={150} className='price' />
                    <Skeleton width={300} className='title' />
                    <div className="w-100">
                        <Skeleton count={1} className='decs' />
                    </div>
                </div>
                <div className="post_time">
                    <Skeleton width={100} />
                </div>
            </div>
        </div>
    )
}

export default ProductHorizontalCardSkeleton