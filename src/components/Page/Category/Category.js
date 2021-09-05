import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import productAPI from '../../../api/productAPI'

import Pagination from '../../../utils/Pagination'
import Product from '../Product/Product'
import Loading from '../../../utils/Loading'
import Error from '../Error/Error'

const Category = () => {
	const { slug } = useParams()
	const [products, setProducts] = useState([])
	const [load, setLoad] = useState(true)
	const [fail, setFail] = useState(false)
	const [totalPage, setTotalPage] = useState('')
	const [currentPage, setCurrentPage] = useState(1)

	useEffect(() => {
		async function fetchProduct() {
			try {
				const params = {
					category: slug,
					_page: currentPage,
					_limit: 9, // tối đa bao nhiêu sản phẩm trong 1 trang
				}
				const result = await productAPI.getAll(params)
				if (result.status === 'Success') {
					setLoad(false)
					setProducts(result.data)
					setTotalPage(result.pagination._total_Page)
				}
			} catch (err) {
				console.log(err)
				if (err) return setFail(true)
			}
		}
		fetchProduct()
	}, [slug, currentPage])

	if (fail) return <Error />

	return (
		<>
			<section className="w-full max-w-screen-xl mx-auto p-2 flex flex-col space-y-2">
				<div className="flex space-x-2 items-center justify-end">
					<button className="h-9 flex items-center justify-center px-3 space-x-2 border-2 border-gray-200 rounded">
						<span>Mới nhất</span>
						<svg
							className="w-6 h-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
							/>
						</svg>
					</button>
					<button className="h-9 flex items-center justify-center px-3 space-x-2 border-2 border-gray-200 rounded">
						<span>Giá</span>
						<svg
							className="w-5 h-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"
							/>
						</svg>
					</button>
				</div>
				<div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
					{products.map((product, index) => (
						<Product sp={product} key={index} />
					))}
					{products.length === 0 && <div className="mx-auto">Trống</div>}
				</div>
				{totalPage > 1 && (
					<Pagination
						totalPage={totalPage}
						currentPage={currentPage}
						setCurrentPage={setCurrentPage}
						slug={slug}
					/>
				)}
			</section>
			{load && <Loading />}
		</>
	)
}

export default Category
