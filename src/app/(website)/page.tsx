import configs from '@/lib/configs';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex h-[calc(100vh-128px)] flex-1 flex-col items-center justify-center">
      <div className="flex items-center gap-x-2">
        <Image alt="logo" width={32} height={32} src={configs.APP_LOGO} />
        {configs.APP_NAME}
      </div>
    </div>
  );
}
