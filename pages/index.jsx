import { useEffect, useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'

export default function Home() {
  
  const [isLoading, setIsLoading] = useState(true)
  const [products, setProducts] = useState([])

  const getHomeProducts = async () => {
    setIsLoading(true)
    const result = await fetch(`/api/products/home`).then(result => result.json()).catch(err => err)
    if(result?.data?.data) setProducts(result?.data?.data); setIsLoading(false)
  }

  const getProducts = async (categoryId) => {
    setIsLoading(true)
    const result = await fetch(`/api/products/${categoryId}`).then(result => result.json()).catch(err => err)
    if(result?.data?.data) setProducts(result?.data?.data); setIsLoading(false)
  }

  const router = useRouter()
  const { category } = router.query

  useEffect( () => {
    console.log('index.js')
    const alternateCategory = location?.search?.split('?')[1]?.split('&')[0]?.split('=')[0] == 'category' 
                            ? location?.search?.split('?')[1]?.split('&')[0]?.split('=')[0][1] : undefined
    if(category || alternateCategory) getProducts(category ?? alternateCategory)
    else getHomeProducts()
  }, [category])

  return (
    <>
      <Head>
        <title>Ecommerce App | Home</title>
        <meta name="description" content="Ecommerce app" />
      </Head>

      <div className="content-wrapper">
        <div className="container-fluid d-flex justify-content-center">
          <div className="row mt-5">
          { isLoading &&
            <h1 className="text-center text-success">Loading products .....</h1>
          }
          { !isLoading &&
            products?.map((product, index) => (
              <div key={index} className="col-sm-4 mb-4">
                <div className="card">
                { (product?.upload?.file_name) &&
                  <Image className="card-img-top preload-images"
                         src={`${process.env.NEXT_PUBLIC_API_Image_URL}/${product?.upload?.file_name}`}
                         alt="Product image" height={130} width={80} />
                }
                { !(product?.upload?.file_name) &&
                  <Image className="card-img-top preload-images"
                         src={`/placeholder.jpg`}
                         alt="Product image" height={130} width={80} />
                }
                  <div className="card-body pt-0 px-0">
                      <h5 className="text-center mt-2">{ product.name.substring(0, 30) }</h5>
                      <div className="d-flex flex-row justify-content-between mb-0 px-3">
                        <small className="mt-1">Price </small>
                        <h6>{ product.unit_price } TK</h6>
                      </div>
                      <div className="mx-3 mt-3 mb-2">
                        <button type="button" className="btn btn-danger btn-block">
                          <small>Buy</small>
                        </button>
                        <button type="button" className="btn btn-success btn-block">
                          <div className="d-flex justify-content-between">
                            <small className="plus-minus">+</small>
                            <small className="plus-minus">-</small>
                          </div>
                        </button>
                      </div>
                  </div>
                </div>
              </div>
            ))
          }

          </div>
        </div>
      </div>
    </>
  )
}