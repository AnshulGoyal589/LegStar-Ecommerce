import Image from 'next/image'

const PromotionalImage   = () => {
  return (
    <div className='px-20' >
        <Image
          src="https://res.cloudinary.com/dkuhayoum/image/upload/v1764928864/a.4_tk1qxj.png"
          alt="Promotional Banner"
          width={1920}
          height={400}
          className="w-full"
        />
    </div>
  )
}

export default PromotionalImage