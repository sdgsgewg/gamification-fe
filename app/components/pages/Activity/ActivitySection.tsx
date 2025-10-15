"use client";

import React, { useRef, useState } from "react";
import ActivityCard from "./ActivityCard";
import { ActivityOverviewResponse } from "@/app/interface/tasks/responses/ITaskOverviewResponse";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { ROUTES } from "@/app/constants/routes";
import { useRouter } from "next/navigation";

interface ActivitySectionProps {
  title: string;
  type?: string;
  activities: ActivityOverviewResponse[];
  showIndex?: boolean;
  showAnsweredCount?: boolean;
  showNewBadge?: boolean;
}

const ActivitySection: React.FC<ActivitySectionProps> = ({
  title,
  type,
  activities,
  showIndex = false,
  showAnsweredCount = false,
  showNewBadge = false,
}) => {
  const router = useRouter();
  const swiperRef = useRef<any>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  if (activities.length === 0) return null;

  const navBtnClass =
    "absolute top-1/2 -translate-y-1/2 z-10 bg-white/70 dark:bg-[#556FD7] rounded-full py-2 px-3 shadow hover:scale-105 transition cursor-pointer";

  const handleNavigateToSectionPage = (section: string) => {
    router.push(`${ROUTES.ROOT.ACTIVITYSECTION}/${section}`);
  };

  const DefaultView = () => {
    return (
      <div className={`relative`}>
        {/* Tombol Navigasi */}
        {!isBeginning && (
          <button
            className={`${navBtnClass} -left-5`}
            onClick={() => swiperRef.current?.slidePrev()}
          >
            <LeftOutlined className="!text-white" />
          </button>
        )}

        {!isEnd && (
          <button
            className={`${navBtnClass} -right-5`}
            onClick={() => swiperRef.current?.slideNext()}
          >
            <RightOutlined className="!text-white" />
          </button>
        )}

        <Swiper
          modules={[Navigation]}
          slidesPerView={1}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          onSlideChange={(swiper) => {
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
          }}
          breakpoints={{
            0: {
              spaceBetween: showIndex ? 24 : 8,
              slidesPerView: showIndex ? 1 : 1,
            },
            480: {
              spaceBetween: showIndex ? 24 : 8,
              slidesPerView: showIndex ? 2 : 2,
            },
            640: {
              spaceBetween: showIndex ? 24 : 12,
              slidesPerView: showIndex ? 2 : 3,
            }, // sm
            768: {
              spaceBetween: showIndex ? 24 : 12,
              slidesPerView: showIndex ? 3 : 4,
            }, // md
            1024: {
              spaceBetween: showIndex ? 28 : 20,
              slidesPerView: showIndex ? 4 : 5,
            }, // lg
            1280: {
              spaceBetween: showIndex ? 48 : 24,
              slidesPerView: showIndex ? 4 : 5,
            }, // xl
          }}
        >
          {activities.map((activity, index) => (
            <SwiperSlide
              key={activity.id}
              className={`!relative !flex !justify-center !items-stretch !h-auto ${
                showIndex ? "pl-8 sm:pl-12 md:pl-10 xl:pl-14" : ""
              }`}
            >
              {showIndex && (
                <span
                  className="absolute -left-2 sm:left-1 md:-left-1 bottom-0 text-6xl sm:text-7xl xl:text-8xl font-black text-blue-950 drop-shadow-sm pointer-events-none select-none"
                  style={{ zIndex: 5 }}
                >
                  {index + 1}
                </span>
              )}

              <ActivityCard
                type={activity.type}
                image={activity.image ?? ""}
                title={activity.title}
                slug={activity.slug}
                subject={activity.subject}
                questionCount={activity.questionCount}
                answeredCount={
                  showAnsweredCount ? activity.answeredCount : undefined
                }
                isNewActivity={showNewBadge}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    );
  };

  const FilterView = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-8 lg:gap-y-12 gap-x-0 sm:gap-x-8 md:gap-x-12">
        {activities.map((activity) => (
          <ActivityCard
            key={activity.id}
            type={activity.type}
            image={activity.image ?? ""}
            title={activity.title}
            slug={activity.slug}
            subject={activity.subject}
            questionCount={activity.questionCount}
            answeredCount={
              showAnsweredCount ? activity.answeredCount : undefined
            }
            isNewActivity={showNewBadge}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        <RightOutlined
          className="!text-black"
          onClick={() => handleNavigateToSectionPage(type ?? "")}
        />
      </div>

      {title === "Hasil Pencarian" ? <FilterView /> : <DefaultView />}
    </div>
  );
};

export default ActivitySection;
