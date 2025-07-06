import React from 'react'

const Builder = () => {
    return (
        <div className='min-h-screen'>
            <div className="h-screen w-screen flex items-center justify-center">
                <div className="flex flex-col gap-6 items-center relative z-20 pt-4 pb-2 max-w-2xl mx-auto px-4">
                    <h1 className="text-white text-4xl md:text-5xl font-bold tracking-tight">
                        App Builder
                    </h1>
                    <p className="text-gray-300 text-lg md:text-xl max-w-xl mx-auto leading-relaxed py-4 text-center">
                        This is the app builder page where you can create and customize your applications.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Builder