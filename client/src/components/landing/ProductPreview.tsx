import React from "react";
import { ContainerScroll } from "../ui/container-scroll-animation";

const ProductPreview: React.FC = () => {
  return (
    <section className="bg-[#020617] py-20 overflow-hidden">
      <ContainerScroll
        titleComponent={
          <div className="flex flex-col items-center">
            <h2 className="text-4xl md:text-7xl font-semibold text-white tracking-tighter mb-4">
              Orchestrate Recovery <br />
              <span className="text-calypso-500 dark:text-calypso-300 font-bold">At Global Scale.</span>
            </h2>
            <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-normal">
              Experience the world's most sophisticated neural engine for 
              autonomous debt resolution and payment intelligence.
            </p>
          </div>
        }
      >
        <img
          src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"
          alt="CollectAI Dashboard"
          className="mx-auto rounded-2xl object-cover h-full object-left-top w-full"
          draggable={false}
        />
      </ContainerScroll>
    </section>
  );
};

export default ProductPreview;
