import React, { useState, useEffect, useContext } from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { GlobalState } from '../../GlobalState'
import axios from 'axios'

const Form = (props) => {
	// default Action is Add
	const action = props.action || 'add'

	// Global state
	const state = useContext(GlobalState)

	// Check admin
	const [admin] = state.isAdmin

	// get token
	const [token] = state.token

	// init Product
	const [product, setProduct] = useState({
		title: '',
		description: '',
		content: 'Đây là phần content của sản phẩm',
		category: '',
		slug: '',
		price: '',
		inStock: '',
		images: [],
	})

	// init category
	const [categories, setCategories] = useState([])

	const [checked, setChecked] = useState(false)

	// handle input
	const onChangeInput = (e) => {
		const { name, value } = e.target
		setProduct({ ...product, [name]: value })
	}

	// convers title to slug
	function string_to_slug(str) {
		str = str.toLowerCase()

		str = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')

		str = str.replace(/[đĐ]/g, 'd')

		str = str.replace(/([^0-9a-z-\s])/g, '')

		str = str.replace(/(\s+)/g, '-')

		str = str.replace(/-+/g, '-')

		str = str.replace(/^-+|-+$/g, '')

		product.slug = str
	}

	// function check Image
	function checkImage(image) {
		if (image.type !== 'image/png' && image.type !== 'image/jpeg')
			return alert('Vui lòng chọn file ảnh')
		if (image.size > 1024 * 1024 * 1024) return alert('Kích thước ảnh quá to')
		return true
	}

	// Upload hình ảnh
	const handleUploadImages = async (e) => {
		e.preventDefault()
		try {
			if (!admin) return alert('bạn không có quyền')
			const files = e.target.files
			if (files.length === 0) return alert('Vui lòng chọn ảnh')
			let formData = new FormData()
			if (files.length === 1) {
				const check = checkImage(files[0])
				if (check) {
					setChecked(true)
					formData.append('file', files[0])
				}
			} else {
				if (files.length > 4) return alert('Tối đa 4 ảnh thôi bạn !')
				for (let file of files) {
					const check = checkImage(file)
					if (check) {
						formData.append('file', file)
					}
				}
			}

			const res = await axios.post('/api/upload', formData, {
				headers: {
					'content-type': 'multipart/form-data',
					Authorization: token,
				},
			})
			console.log(res.data.images)
			setProduct({
				...product,
				images: [...product.images, ...res.data.images],
			})
		} catch (error) {
			console.log(error)
		}
	}

	// handle upload product
	const handleAddProduct = async (e) => {
		e.preventDefault()
		try {
			if (!admin) return alert('Mày không có quyền')
			const check = await axios.post(
				'/api/product',
				{ ...product },
				{ header: { Authorization: token } }
			)
			if (check.status === 200) {
				alert(check.data.message)
			}
			console.log(check)
		} catch (error) {
			console.log(error)
		}
	}

	// Handle Edit product
	const handleEditProduct = async (e) => {
		e.preventDefault()
		try {
			if (!admin) return alert('Mày không có quyền')
			const check = await axios.put(
				`/api/product/${product._id}`,
				{ ...product },
				{ header: { Authorization: token } }
			)
			if (check.status === 200) {
				alert(check.data.message)
			}
		} catch (error) {
			console.log(error)
		}
	}

	// delete image
	const handleDestroy = async (public_id) => {
		try {
			if (!admin) return alert('Mày không có quyền')

			await axios.post(
				'/api/destroy',
				{ public_id: [public_id] },
				{
					headers: { Authorization: token },
				}
			)
			product.images.forEach((item, index) => {
				if (item.public_id === public_id) product.images.splice(index, 1)
			})
			setProduct({ ...product })
		} catch (err) {
			alert(err)
		}
	}

	useEffect(() => {
		try {
			const getCategories = async () => {
				const res = await axios.get('/api/category')
				setCategories(res.data.data)
			}
			getCategories()
		} catch (error) {
			alert(error)
		}
	}, [])
	const hanbleButton = (e) => {
		e.preventDefault()
		props.setToggleForm(!props.toggleForm)
	}
	!props.toggleForm
		? document.querySelector('body').classList.add('overflow-hidden')
		: document.querySelector('body').classList.remove('overflow-hidden')
	return (
		<form
			onSubmit={action ? handleEditProduct : handleAddProduct}
			className={`fixed top-0 bottom-0 right-0 left-0 pt-10 z-30 lg:pl-56 p-6 xl:pl-44 shadows-xl min-h-screen flex flex-col bg-gray-300 bg-opacity-90 transition duration-700 transform overflow-scroll ${
				props.toggleForm && 'translate-y-full'
			}`}
		>
			<button
				onClick={hanbleButton}
				className="absolute right-1 top-2 md:right-16 md:top-5 text-red-500"
			>
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
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			</button>
			<div className="flex flex-col p-1 w-full max-w-screen-lg mx-auto md:flex-row md:space-x-4">
				<div className="h-96 md:h-542px md:w-1/2 shadow appearance-none border rounded w-full text-gray-700 leading-tight overflow-hidden flex items-center justify-center focus:outline-none focus:shadow-outline relative">
					{product.images[0] ? (
						<>
							<img
								src={product.images[0].url}
								alt=""
								className="h-full object-cover"
							/>
							<div
								onClick={() => handleDestroy(product.images[0].public_id)}
								className="absolute top-1 right-1 text-red-300 cursor-pointer"
							>
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
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</div>
						</>
					) : (
						<label
							htmlFor="image-upload"
							className="w-full h-full flex items-center justify-center bg-gray-100"
						>
							<svg
								className="w-10 h-10"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 6v6m0 0v6m0-6h6m-6 0H6"
								/>
							</svg>
						</label>
					)}

					<input
						type="file"
						hidden
						id="image-upload"
						onChange={handleUploadImages}
					/>
				</div>
				<div className="w-full flex flex-col px-5 space-y-2 text-sm md:text-base md:w-1/2 md:px-0 md:pl-5">
					<div className="space-y-1">
						<h1 className="text-sm md:text-md md:font-semibold">
							Tên sản phẩm
						</h1>
						<input
							placeholder="Nhập tên sản phẩm ở đây......"
							name="title"
							autoComplete="off"
							value={product.title}
							onChange={onChangeInput}
							onInput={string_to_slug(product.title)}
							className="shadow text-lg appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						/>
					</div>
					<p className="text-gray-400 h-6" id="slug-innner">
						{product.slug
							? '/' + product.slug
							: 'Phần slug sẽ được tạo tự động ở đây'}
					</p>
					<input
						type="text"
						name="slug"
						hidden
						value={product.slug}
						onChange={onChangeInput}
					/>
					<div className="space-y-1">
						<h1 className="text-sm md:text-md md:font-semibold">Mô tả</h1>
						<textarea
							className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
							placeholder="Nhập mô tả ngắn ở đây nè"
							rows="5"
							name="description"
							value={product.description}
							onChange={onChangeInput}
						></textarea>
					</div>
					<div className="space-y-1">
						<h1 className="text-sm md:text-md md:font-semibold">
							Giá :{' '}
							<span className="ml-2">
								{product.price && parseInt(product.price).toLocaleString('en')}{' '}
								VNĐ
							</span>
						</h1>
						<input
							type="number"
							placeholder="Nhập giá nè"
							className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
							name="price"
							value={product.price}
							onChange={onChangeInput}
						/>
						<span className="ml-2 text-sm font-semibold">VNĐ</span>
					</div>
					<div className="flex flex-col order-first  md:order-none md:justify-start pb-2 lg:pb-0">
						<h1 className="text-sm md:text-md md:font-semibold">
							Các ảnh khác (tối đa 4 ảnh / vui lòng chọn ảnh lớn trước)
						</h1>
						<div className="flex md:justify-start justify-center items-center space-x-2">
							{product.images.length < 2 ? (
								<label
									htmlFor="imagess"
									className="w-20 h-20 rounded bg-gray-100 shadow flex items-center justify-center"
								>
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
											d="M12 6v6m0 0v6m0-6h6m-6 0H6"
										/>
									</svg>
								</label>
							) : (
								product.images.map((image, index) => (
									<div
										className="w-20 h-20 rounded bg-gray-100 shadow flex items-center justify-center overflow-hidden relative"
										key={index}
									>
										<img
											className="h-full object-cover"
											src={image.url}
											alt=""
										/>
										<div
											onClick={() => handleDestroy(image.public_id)}
											className="absolute top-1 right-1 text-red-300 cursor-pointer"
										>
											<svg
												className="w-3 h-3"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M6 18L18 6M6 6l12 12"
												/>
											</svg>
										</div>
									</div>
								))
							)}
						</div>
						{checked ? (
							<input
								type="file"
								id="imagess"
								hidden
								multiple
								onChange={handleUploadImages}
							/>
						) : (
							''
						)}
					</div>
					<div className="space-y-1">
						<h1 className="text-sm md:text-md md:font-semibold">
							Nhập số lượng trong kho
						</h1>
						<input
							className="shadow appearance-none border rounded  py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
							placeholder="Nhập số lượng ở đây nè"
							type="number"
							name="inStock"
							value={product.inStock}
							onChange={onChangeInput}
						/>
					</div>

					<div className="text-base flex flex-col space-y-1">
						<h1 className="text-sm md:text-md md:font-semibold">
							Chọn danh mục
						</h1>
						<div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-4">
							<select
								onChange={onChangeInput}
								name="category"
								value={action === 'edit' && product.category}
								className="shadow appearance-none border rounded px-2 py-2 text-gray-700 focus:outline-none focus:shadow-outline xl:px-4"
							>
								<option value="" hidden>
									Chọn danh mục
								</option>
								{action === 'edit'
									? categories.map((category, index) => (
											<option key={index} value={category.slug}>
												{category.name}
											</option>
									  ))
									: categories.map((category, index) => (
											<option key={index} value={category.slug}>
												{category.name}
											</option>
									  ))}
							</select>
							<button
								type="submit"
								className="px-2 py-2 text-gray-900 bg-gray-100 rounded font-semibold border shadow xl:px-4"
							>
								{action === 'add' ? 'Thêm sản phẩm' : 'Cập nhật sản phẩm'}
							</button>
						</div>
					</div>
				</div>
			</div>
			<div className="mt-2 mx-auto w-full max-w-screen-lg p-1 unreset">
				<CKEditor
					editor={ClassicEditor}
					data={product.content}
					// Hide upload image
					//=--------------------------------

					// config={{
					// 	ckfinder: {
					// 		uploadUrl: '/api/upload',
					// 		headers: {
					// 			Authorization: token,
					// 		},
					// 	},
					// }}

					//=--------------------------------
					onChange={(event, editor) => {
						const data = editor.getData()
						setProduct({ ...product, content: data })
					}}
				/>
			</div>
		</form>
	)
}

export default Form
