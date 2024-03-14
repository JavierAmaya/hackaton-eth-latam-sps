"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { NextPage } from "next";
import { studentsData } from "~~/lib/students";

const Home: NextPage = () => {
  const [currentStudent, setCurrentStudent] = useState(0);
  return (
    <>
      <div className="hero bg-base-200 flex-grow pt-8">
        <div className="hero-content px-6 flex flex-col lg:flex-row lg:items-start md:pb-24 lg:pb-8 xl:pb-16 md:w-3/4 lg:w-full lg:px-12 xl:px-16">
          <div className="w-full lg:w-1/2 lg:flex lg:flex-col lg:pt-8">
            <h1 className="text-4xl leading-[1.05]">
              Regeneramos la educación
              <br />
              desde nuestras comunidades
            </h1>
            <p className="pt-4 text-2xl">
              Ayudemos a cumplir los sueños de los estudiantes con bienes públicos gestionados por nuestras comunidades
            </p>
            <div className="w-full flex justify-center pt-8">
              <Link href={`/estudiante/${currentStudent}`} className="w-1/2">
                <button className="btn btn-primary btn-lg">Apadrina a {studentsData[currentStudent].name}</button>
              </Link>
            </div>
          </div>
          <div className="w-full lg:w-1/2 lg:px-4">
            <div className="bg-base-100 border-primary border-2 shadow-md shadow-secondary rounded-xl px-6 lg:px-8 mb-6 space-y-2 py-8 w-full">
              <div className="flex justify-center w-full">
                <div className="w-full carousel rounded-box">
                  {studentsData.map((student, index) => (
                    <div
                      key={`student_${index}`}
                      id={`student_${index}`}
                      className="carousel-item w-full aspect-square relative flex flex-col"
                    >
                      <div className="w-full flex justify-start">
                        <h2 className="text-3xl font-medium">{student.name}</h2>
                      </div>
                      <p className="m-0">{student.bio}</p>
                      <div className="grid grid-cols-3 mb-4 px-8">
                        <div className="flex flex-col items-center pt-3">
                          <p className="m-0 text-2xl">{student.attendance}</p>
                          <p className="m-0 text-lg">Asistencia</p>
                        </div>
                        <div className="flex flex-col items-center pt-3">
                          <p className="m-0 text-2xl">{student.average}</p>
                          <p className="m-0 text-lg">Promedio</p>
                        </div>
                        <div className="flex flex-col items-center pt-3">
                          <p className="m-0 text-2xl">{student.extracurriculares}</p>
                          <p className="m-0 text-lg">Extracurricular</p>
                        </div>
                      </div>
                      <Image
                        src={student.image_url}
                        className="w-full aspect-square px-32 pt-52 pb-0"
                        alt="Tailwind CSS Carousel component"
                        fill
                      />
                      <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                        <a
                          href={index - 1 >= 0 ? `#student_${index - 1}` : `#student_0`}
                          className={`btn btn-circle`}
                          onClick={() => index - 1 >= 0 && setCurrentStudent(index - 1)}
                        >
                          ❮
                        </a>
                        <a
                          href={`#student_${index + 1}`}
                          className={`btn btn-circle ${index + 1 >= studentsData.length && "hidden"}`}
                          onClick={() => setCurrentStudent(index + 1)}
                        >
                          ❯
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
