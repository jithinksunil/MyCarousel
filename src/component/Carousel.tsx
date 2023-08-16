import { useCallback, useEffect, useRef } from 'react';
import classes from '../styles/Carousel.module.css'
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import { debounce } from '@mui/material';

interface PropsType {
  cardGap: number;
  children: any;
  heading?: string;
  noOfCards: number;
}
export function Carousel(props: PropsType) {
  const { cardGap, children, heading, noOfCards } = props;
  const parentContainerRef = useRef<HTMLDivElement>(null);
  const flexContainer = useRef<HTMLDivElement>(null);
  const thumb = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const scrollPlacerRef = useRef<HTMLDivElement>(null);
  const leftArrowRef = useRef<HTMLDivElement>(null);
  const rightArrowRef = useRef<HTMLDivElement>(null);

  const flexContainerWidth = () => flexContainer.current!.offsetWidth;

  const cardWidth = () =>
    (flexContainerWidth() + cardGap) / noOfCards - cardGap;

  const parentContainerWidth = () => parentContainerRef.current!.offsetWidth;

  const trackWidth = () => track.current!.offsetWidth;

  const thumbWidth = () =>
    (trackWidth() * parentContainerWidth()) / flexContainerWidth();

  const scrollLength = () => parentContainerRef.current!.scrollLeft

  const showAndHideScrollBarAndButtons = useCallback(
    (scrolledLength?: number) => {
      const maxScrollableLength = flexContainerWidth() - parentContainerWidth();
      const minScrollableLength = 0;
      if (scrolledLength !== undefined) {
        //left arrow hiding part
        if (scrolledLength > minScrollableLength) {
          leftArrowRef.current!.style.display = 'flex';
        } else {
          leftArrowRef.current!.style.display = 'none';
        }
        
        //right arrow hiding part
        if (scrolledLength < maxScrollableLength) {
          rightArrowRef.current!.style.display = 'flex';
        } else {
          rightArrowRef.current!.style.display = 'none';
        }
      }

      //progress bar and arrows hidding part
      if (
        scrollPlacerRef.current &&
        leftArrowRef.current &&
        rightArrowRef.current
      ) {
        if (flexContainerWidth() <= parentContainerWidth()) {
          scrollPlacerRef.current.style.display = 'none';
          leftArrowRef.current.style.display = 'none';
          rightArrowRef.current.style.display = 'none';
        } else {
          scrollPlacerRef.current.style.display = 'flex';
          if (!scrolledLength){
            rightArrowRef.current.style.display = 'flex';
          }
        }
      }

      //thumb width setting
      if (thumb.current) {
        thumb.current.style.width = thumbWidth() + 'px';
      }

    },
    []
  );

  const limitMaxAndMin = (scroll: number) => {
    const maxScrollableLength = flexContainerWidth() - parentContainerWidth();
    const minScrollableLength = 0;

    if (scroll <= minScrollableLength) {
      return minScrollableLength;
    } else if (scroll >= maxScrollableLength) {
      return maxScrollableLength;
    } else return scroll;
  };

  const moveFlex = (movingLength: number) => {
    const scroll = limitMaxAndMin(scrollLength() + movingLength);

    parentContainerRef.current!.scrollLeft = scroll;

    showAndHideScrollBarAndButtons(scroll);

    //progressBar part
    const translateTumbLength = (trackWidth() * scroll) / flexContainerWidth();
    thumb.current!.style.transform = `translate(${translateTumbLength}px)`;
  };

  const moveLeft = () => {
    moveFlex(-(cardWidth() + cardGap));
  };
  const moveRight = () => {
    moveFlex(cardWidth() + cardGap);
  };

  useEffect(() => {
    //flex container width setting
    flexContainer.current!.style.gap = cardGap + 'px';

    //track length setting
    leftArrowRef.current!.style.display = 'none';

    showAndHideScrollBarAndButtons();
  }, [noOfCards, cardGap, showAndHideScrollBarAndButtons]);


  useEffect(() => {
    const debouncer=debounce(() => {
      showAndHideScrollBarAndButtons();
    }, 500)

    const resizeObserver = new ResizeObserver(() => {
      debouncer()
    });
    const parentContainer=parentContainerRef.current!
    resizeObserver.observe(parentContainer);
    return () => {
      resizeObserver.unobserve(parentContainer);
      resizeObserver.disconnect();
    };
  });

  return (
    <div>
      {heading && (
        <h1 className='text-base md:text-2xl font-medium mb-3 md:mb-5'>
          {heading}
        </h1>
      )}
      <div className={classes.buttonHolder}>
        <div ref={parentContainerRef} className={classes.parentContainer}>
          <div ref={flexContainer} className={classes.flexContainer}>
            {children}
          </div>
        </div>
        <div
          ref={leftArrowRef}
          className={classes.leftButton}
          onClick={moveLeft}
        >
          <KeyboardArrowLeft />
        </div>
        <div
          ref={rightArrowRef}
          className={classes.rightButton}
          onClick={moveRight}
        >
          <KeyboardArrowRight />
        </div>
      </div>

      <div ref={scrollPlacerRef} className={classes.scrollPlacer}>
        <div ref={track} className={classes.scrollTrack}>
          <div ref={thumb} className={classes.thumb}></div>
        </div>
      </div>
    </div>
  );
}
