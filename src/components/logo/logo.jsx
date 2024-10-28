import { useId, forwardRef } from 'react';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { RouterLink } from '../../routes/components';
import { logoClasses } from './classes';

// ----------------------------------------------------------------------

export const Logo = forwardRef(
  (
    { width, href = '/', height, isSingle = true, disableLink = false, className, sx, ...other },
    ref
  ) => {
    const theme = useTheme();
    const gradientId = useId();

    const TEXT_PRIMARY = theme.vars.palette.text.primary;
    const PRIMARY_LIGHT = theme.vars.palette.primary.light;
    const PRIMARY_MAIN = theme.vars.palette.primary.main;
    const PRIMARY_DARKER = theme.vars.palette.primary.dark;

    const singleLogo = (
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 512 512"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill={`url(#${`${gradientId}-1`})`}
          d="M86.352 246.358C137.511 214.183 161.836 245.017 183.168 285.573C165.515 317.716 153.837 337.331 148.132 344.418C137.373 357.788 125.636 367.911 111.202 373.752C80.856 388.014 43.132 388.681 14 371.048L86.352 246.358Z"
        />
        <path
          fill={`url(#${`${gradientId}-2`})`}
          fillRule="evenodd"
          clipRule="evenodd"
          d="M444.31 229.726C398.04 148.77 350.21 72.498 295.267 184.382C287.751 198.766 282.272 226.719 270 226.719V226.577C257.728 226.577 252.251 198.624 244.735 184.24C189.79 72.356 141.96 148.628 95.689 229.584C92.207 235.69 88.862 241.516 86 246.58C192.038 179.453 183.11 382.247 270 383.858V384C356.891 382.389 347.962 179.595 454 246.72C451.139 241.658 447.794 235.832 444.31 229.726Z"
        />
        <path
          fill={`url(#${`${gradientId}-3`})`}
          fillRule="evenodd"
          clipRule="evenodd"
          d="M450 384C476.509 384 498 362.509 498 336C498 309.491 476.509 288 450 288C423.491 288 402 309.491 402 336C402 362.509 423.491 384 450 384Z"
        />
        <defs>
          <linearGradient
            id={`${gradientId}-1`}
            x1="152"
            y1="167.79"
            x2="65.523"
            y2="259.624"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={PRIMARY_DARKER} />
            <stop offset="1" stopColor={PRIMARY_MAIN} />
          </linearGradient>
          <linearGradient
            id={`${gradientId}-2`}
            x1="86"
            y1="128"
            x2="86"
            y2="384"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={PRIMARY_LIGHT} />
            <stop offset="1" stopColor={PRIMARY_MAIN} />
          </linearGradient>
          <linearGradient
            id={`${gradientId}-3`}
            x1="402"
            y1="288"
            x2="402"
            y2="384"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={PRIMARY_LIGHT} />
            <stop offset="1" stopColor={PRIMARY_MAIN} />
          </linearGradient>
        </defs>
      </svg>
    );

    const fullLogo = (
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 360 128"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill={`url(#${`${gradientId}-1`})`}
          d="M21.588 61.59C34.378 53.546 40.458 61.254 45.792 71.393C41.379 79.429 38.459 84.333 37.032 86.105C34.343 89.447 31.409 91.978 27.8 93.438C20.214 97.004 10.783 97.17 3.5 92.762L21.588 61.59Z"
        />
        <path
          fill={`url(#${`${gradientId}-2`})`}
          fillRule="evenodd"
          clipRule="evenodd"
          d="M111.078 57.431C99.51 37.194 87.552 18.124 73.817 46.096C71.937 49.69 70.568 56.68 67.5 56.68V56.644C64.432 56.644 63.063 49.656 61.184 46.06C47.448 18.09 35.49 37.157 23.922 57.396C23.052 58.922 22.216 60.379 21.5 61.645C48.01 44.863 45.778 95.562 67.5 95.965V96C89.223 95.597 86.99 44.899 113.5 61.68C112.785 60.414 111.949 58.957 111.078 57.431Z"
        />
        <path
          fill={`url(#${`${gradientId}-3`})`}
          fillRule="evenodd"
          clipRule="evenodd"
          d="M112.5 96C119.127 96 124.5 90.627 124.5 84C124.5 77.373 119.127 72 112.5 72C105.873 72 100.5 77.373 100.5 84C100.5 90.627 105.873 96 112.5 96Z"
        />
        <path
          fill={TEXT_PRIMARY}
          fillRule="evenodd"
          clipRule="evenodd"
          d="M146.031 45.215C149.553 45.215 152.103 42.825 152.103 39.587C152.103 36.348 149.553 34 146.031 34C142.591 34 140 36.348 140 39.587C140 42.826 142.591 45.215 146.031 45.215ZM146.031 93.838C149.351 93.838 151.374 91.854 151.374 87.968V55.984C151.374 52.097 149.351 50.073 146.072 50.073C142.753 50.073 140.729 52.097 140.729 55.983V87.968C140.729 91.814 142.753 93.838 146.031 93.838ZM200.394 88.008C200.394 91.773 198.491 93.838 195.091 93.838C191.65 93.838 189.748 91.733 189.748 87.968V67.563C189.748 61.935 186.955 58.777 182.017 58.777C176.471 58.777 172.99 62.867 172.99 69.547V87.967C172.99 91.733 171.047 93.838 167.647 93.838C164.247 93.838 162.304 91.733 162.304 87.968V55.78C162.304 52.258 164.328 50.072 167.566 50.072C170.764 50.072 172.626 51.975 172.747 55.416V58.048H173.273C174.933 52.946 179.75 49.788 186.064 49.788C195.213 49.788 200.394 55.214 200.394 64.647V88.008Z"
        />
        <defs>
          <linearGradient
            id={`${gradientId}-1`}
            x1="59.123"
            y1="31.732"
            x2="8.55"
            y2="71.247"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={PRIMARY_DARKER} />
            <stop offset="1" stopColor={PRIMARY_MAIN} />
          </linearGradient>
          <linearGradient
            id={`${gradientId}-2`}
            x1="10"
            y1="10"
            x2="10"
            y2="100"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={PRIMARY_LIGHT} />
            <stop offset="1" stopColor={PRIMARY_MAIN} />
          </linearGradient>
          <linearGradient
            id={`${gradientId}-3`}
            x1="124"
            y1="72"
            x2="124"
            y2="94"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={PRIMARY_LIGHT} />
            <stop offset="1" stopColor={PRIMARY_MAIN} />
          </linearGradient>
        </defs>
      </svg>
    );

    const baseSize = isSingle ? 40 : 120;

    const logo = isSingle ? singleLogo : fullLogo;

    return (
      <Box
        component={disableLink ? 'span' : RouterLink}
        ref={ref}
        href={disableLink ? undefined : href}
        className={`${logoClasses.logo} ${className}`}
        sx={{
          width: width || baseSize,
          height: height || baseSize,
          ...sx,
        }}
        {...other}
      >
        {logo}
      </Box>
    );
  }
);

export default Logo;
