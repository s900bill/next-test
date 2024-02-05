// pages/index.js
import React, { useState, useEffect } from 'react'

import axios from '../utils/axiosInstance'
import Image from 'next/image'
import { useRouter } from 'next/router'
import Category from './order/category'
import Product from './order/product'
import NotificationModal from './components/notificationModal'
import ShoppingCar from './components/shoppingcar'

function Home({ categorys, products }) {
  const router = useRouter()
  const { No } = router.query
  const [showNotificationModal, setshowNotificationModal] = useState(true)
  const [showproduct, setshowproduct] = useState(false)
  const [productlist, setproductlist] = useState([])
  const [selectedcategory, setselectedcategory] = useState(1)
  const [car, setcar] = useState({})
  const [showShoppingCar, setshowShoppingCar] = useState(false)
  const selectCategory = (target) => {
    setselectedcategory(target)
    setproductlist(products.filter((x) => x.categoryid === target.categoryid))
    setshowproduct(true)
  }
  const productBack = () => {
    setshowproduct(false)
  }

  useEffect(() => {
    const hasVisited = sessionStorage.getItem('hasVisited')
    if (!hasVisited) {
      setshowNotificationModal(true)
      sessionStorage.setItem('hasVisited', 'true')
    }
  }, [])
  const handleClose = () => {
    setshowNotificationModal(false)
  }
  const editcar = (item) => {
    let newCar = { ...car }
    const key = item.product.productid
    if (!newCar[key]) {
      newCar[key] = {
        product: item.product,
        count: 0,
      }
    }
    switch (item.type) {
      case 'plus':
        newCar[key].count += 1
        break

      case 'minus':
        if (newCar[key] >= 1) {
          newCar[key] -= 1
        }
        break
    }
    setcar(newCar) // 使用新对象更新状态
  }
  const openCar = () => {
    setshowShoppingCar(true)
  }
  return (
    <div className="container mx-auto flex h-screen flex-col px-5 lg:max-w-7xl">
      <div className="flex justify-between pb-4 pt-9">
        <div>
          <Image
            src="/images/hamburger.svg" // 圖片的路徑
            alt="hamburger" // 圖片描述
            width={36} // 圖片的寬度
            height={36} // 圖片的高度
            layout="responsive" // 圖片的佈局方式
          />
        </div>
        <div onClick={openCar}>
          <Image
            src="/images/car.svg" // 圖片的路徑
            alt="購物車" // 圖片描述
            width={36} // 圖片的寬度
            height={36} // 圖片的高度
            layout="responsive" // 圖片的佈局方式
          />
        </div>
      </div>
      <div className="mx-auto max-w-2xl ">
        <Image
          src="/images/logo_title.svg" // 圖片的路徑
          alt="star icon" // 圖片描述
          width={335} // 圖片的寬度
          height={100} // 圖片的高度
          layout="responsive" // 圖片的佈局方式
        />
      </div>
      <div className="w-full max-w-2xl flex-1 sm:px-6 lg:max-w-7xl lg:px-8">
        {showNotificationModal && <NotificationModal onClose={handleClose} />}

        {!showNotificationModal && !showproduct && (
          <Category categorys={categorys} onSelect={selectCategory}></Category>
        )}
        {!showNotificationModal && showproduct && (
          <Product
            products={productlist}
            category={selectedcategory}
            car={car}
            editcar={editcar}
            onBack={productBack}
          ></Product>
        )}
      </div>

      <div className="" style={{ height: '56px' }}>
        {/* footbanner空間 */}
      </div>
      {showShoppingCar && (
        <ShoppingCar
          car={Object.values(car)}
          no={No}
          onClose={() => {
            setshowShoppingCar(false)
          }}
        ></ShoppingCar>
      )}
    </div>
  )
}

export async function getServerSideProps() {
  let categorys = []
  let products = []
  await axios
    .get('/category/getAllCategory')
    .then((res) => {
      categorys = res.data
    })
    .catch((error) => {
      console.error('Failed to fetch data:', error)
    })
  await axios
    .get('/product/getAllProduct')
    .then((res) => {
      products = res.data
    })
    .catch((error) => {
      console.error('Failed to fetch getAllProduct:', error)
    })
  return {
    props: {
      categorys: categorys,
      products: products,
    },
    //revalidate: 10, // In seconds (optional, for incremental static regeneration)
  }
}

export default Home
