import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { GlobalState } from '../../GlobalState'
import boxPNG from '../../images/box.png'
import housePNG from '../../images/house.png'
import ticketPNG from '../../images/ticket.png'
import productPNG from '../../images/product.png'
import userPNG from '../../images/user.png'
import trashPNG from '../../images/delete.png'
const SidebarAdmin = (props) => {
	const { logout } = useContext(GlobalState)
	const { handleSidebar, open, setOpen } = props.option
	open
		? document.body.classList.add('overflow-hidden')
		: document.body.classList.remove('overflow-hidden')
	window.addEventListener('resize', function () {
		setOpen(false)
	})

	return (
		<>
			<div className="top-0 left-0 right-0 h-10 flex items-center fixed bg-white lg:hidden z-30">
				<button onClick={handleSidebar} className="p-3">
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
							d="M4 6h16M4 12h8m-8 6h16"
						/>
					</svg>
				</button>
			</div>
			<div
				className={`fixed h-screen w-56 bg-white overflow-y-auto flex-col shadow-xl transition flex justify-between z-40 transform lg:transform-none ${
					!open && '-translate-x-full'
				}`}
			>
				<button className="absolute p-3 lg:hidden" onClick={handleSidebar}>
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
				<div className="pt-16 pb-5 pl-2 flex space-x-1 justify-center items-center text-xl text-purple-600 font-extrabold">
					<h1 className="cursor-default">l1rf store</h1>
				</div>
				<div className="mb-auto flex flex-col p-2 space-y-2">
					<NavLink
						to="/"
						onClick={handleSidebar}
						className="flex items-center space-x-2 h-10 px-2 rounded-md transition duration-300 hover:bg-green-300 bg-opacity-60 text-sm font-semibold"
					>
						<img src={housePNG} alt="" className="w-5 h-5" />

						<span>Trang chủ</span>
					</NavLink>
					<NavLink
						to="/products"
						onClick={handleSidebar}
						className="flex items-center space-x-2 h-10 px-2 rounded-md transition duration-300 hover:bg-green-300 bg-opacity-60 text-sm font-semibold"
						activeClassName="bg-green-300 bg-opacity-60 dark:bg-gray-900 dark:text-white"
					>
						<img src={boxPNG} alt="" className="w-5 h-5" />
						<span>Tất cả sản phẩm</span>
					</NavLink>
					<NavLink
						to="/orders"
						onClick={handleSidebar}
						activeClassName="bg-green-300 bg-opacity-60 dark:bg-gray-900 dark:text-white"
						className="flex items-center space-x-2 h-10 px-2 rounded-md transition duration-300 hover:bg-green-300 bg-opacity-60 text-sm font-semibold"
					>
						<img src={ticketPNG} alt="" className="w-5 h-5" />
						<span>Tất cả hóa đơn</span>
					</NavLink>
					<NavLink
						to="/add"
						onClick={handleSidebar}
						activeClassName="bg-green-300 bg-opacity-60 dark:bg-gray-900 dark:text-white"
						className="flex items-center space-x-2 h-10 px-2 rounded-md transition duration-300 hover:bg-green-300 bg-opacity-60 text-sm font-semibold"
					>
						<img src={productPNG} alt="" className="w-5 h-5" />
						<span>Thêm sản phẩm mới</span>
					</NavLink>
					<NavLink
						to="/allusers"
						activeClassName="bg-green-300 bg-opacity-60 dark:bg-gray-900 dark:text-white"
						onClick={handleSidebar}
						className="flex items-center space-x-2 h-10 px-2 rounded-md transition duration-300 hover:bg-green-300 bg-opacity-60 text-sm font-semibold"
					>
						<img src={userPNG} alt="" className="w-5 h-5" />
						<span>Quản lý tài khoản</span>
					</NavLink>
					<NavLink
						to="/trash"
						activeClassName="bg-green-300 bg-opacity-60 dark:bg-gray-900 dark:text-white"
						onClick={handleSidebar}
						className="flex items-center space-x-2 h-10 px-2 rounded-md transition duration-300 hover:bg-green-300 bg-opacity-60 text-sm font-semibold"
					>
						<img src={trashPNG} alt="" className="w-5 h-5" />
						<span>BTS</span>
					</NavLink>
				</div>
				<div className="p-2 mb-5">
					<button
						onClick={logout}
						className="w-full flex items-center space-x-2 text-left leading-10 h-10 px-2 rounded-md transition duration-300 text-sm font-semibold"
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
								d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
							/>
						</svg>
						<span>Đăng xuất</span>
					</button>
				</div>
			</div>
			<div
				onClick={handleSidebar}
				className={`fixed lg:hidden h-screen w-full ml-56 bg-gray-600 bg-opacity-10 transition z-40 transform lg:transform-none ${
					!open && 'translate-x-full'
				}`}
			></div>
		</>
	)
}

export default SidebarAdmin
