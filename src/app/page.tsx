import Carousel from './components/home/Carousel';

const HomePage = () => {
  return (
    <>
      <div className="w-full p-4">
        <h1 className="my-4 text-2xl font-bold">Home Page</h1>
        <Carousel />
        <ul>
          <li>-about</li>
          <li>-new arrivals preview</li>
          <li>-why us</li>
        </ul>
      </div>
    </>
  );
};

export default HomePage;
