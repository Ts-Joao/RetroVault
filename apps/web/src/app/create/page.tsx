'use client'

import Footer from "@/components/layout/footer/Footer"
import NavBar from "@/components/layout/nav-bar/NavBar"

export default function Create() {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="grow mx-50 mt-10">
        <h1 className="text-3xl font-bold">Cadastre seu produto</h1>
        <p>Preencha os campos abaixo para cadastrar um novo produto:</p>
            <form className="mt-4">
                <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Nome
                    </label>
                    <input
                        type="text"
                        id="name"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Descrição
                    </label>
                    <textarea
                        id="description"
                        rows={3}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                        Preço
                    </label>
                    <input
                        type="number"
                        id="price"
                        step="0.01"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Cadastrar Produto
                </button>
            </form>
      </main>
      <Footer />
    </div>
  )
}