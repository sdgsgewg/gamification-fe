"use client";

import React, { useRef, useState } from "react";
import ActivityCard from "./ActivityCard";
import { ActivityOverviewResponse } from "@/app/interface/activities/responses/IActivityOverviewResponse";
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

  const navigateToSectionPage = (section: string) => {
    router.push(`${ROUTES.ROOT.ACTIVITYSECTION}/${section}`);
  };

  const DefaultView = () => {
    const swiperRef = useRef<any>(null);
    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);

    const navBtnClass =
      "absolute top-1/2 -translate-y-1/2 z-10 bg-white/70 dark:bg-[#556FD7] rounded-full py-2 px-3 shadow hover:scale-105 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

    const breakpoints = {
      0: {
        slidesPerView: showIndex ? 1 : 1,
        slidesPerGroup: 1,
        spaceBetween: 8,
      },
      360: {
        slidesPerView: showIndex ? 1 : 2,
        slidesPerGroup: 1,
        spaceBetween: 8,
      },
      480: {
        slidesPerView: showIndex ? 2 : 2,
        slidesPerGroup: 1,
        spaceBetween: 8,
      },
      640: {
        slidesPerView: showIndex ? 2 : 3,
        slidesPerGroup: 1,
        spaceBetween: 12,
      },
      768: {
        slidesPerView: showIndex ? 3 : 4,
        slidesPerGroup: 1,
        spaceBetween: 12,
      },
      1024: {
        slidesPerView: showIndex ? 4 : 5,
        slidesPerGroup: 1,
        spaceBetween: 20,
      },
      1280: {
        slidesPerView: showIndex ? 4 : 5,
        slidesPerGroup: 1,
        spaceBetween: 24,
      },
    };

    return (
      <div className="relative">
        {/* Navigation Buttons */}
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
          slidesPerGroup={1}
          breakpoints={breakpoints}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;

            // Pastikan slidesPerView adalah number
            const slidesPerView =
              typeof swiper.params.slidesPerView === "number"
                ? swiper.params.slidesPerView
                : 1;

            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd || swiper.slides.length <= slidesPerView);
          }}
          onSlideChangeTransitionEnd={() => {
            const swiper = swiperRef.current;
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
          }}
          loop={false}
        >
          {activities.map((activity, index) => (
            <SwiperSlide
              key={activity.id}
              className={`!relative !h-auto !flex !justify-start !items-stretch ${
                showIndex ? "pl-8 xxs:pl-16 xs:pl-14 md:pl-10 xl:pl-14" : ""
              }`}
            >
              {showIndex && (
                <span
                  className="absolute -left-2 xxs:left-4 sm:left-1 md:-left-1 bottom-0 text-6xl xxs:text-7xl xs:text-6xl xl:text-8xl font-black text-activity-rank drop-shadow-sm pointer-events-none select-none"
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
                grade={activity.grade}
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
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-8 lg:gap-y-12 gap-x-0 xs:gap-x-4 sm:gap-x-8 md:gap-x-12">
        {activities.map((activity) => (
          <ActivityCard
            key={activity.id}
            type={activity.type}
            image={activity.image ?? ""}
            title={activity.title}
            slug={activity.slug}
            subject={activity.subject}
            grade={activity.grade}
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

  if (activities.length === 0) return null;

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        {type && (
          <RightOutlined
            className="!text-dark cursor-pointer hover:scale-110 transition"
            onClick={() => navigateToSectionPage(type)}
          />
        )}
      </div>

      {title === "Hasil Pencarian" ? <FilterView /> : <DefaultView />}
    </div>
  );
};

export default ActivitySection;
