import { useEffect, useRef, useState } from 'react';
import { DotLottieReact, setWasmUrl, type DotLottie } from '@lottiefiles/dotlottie-react';
import dotLottieWasmUrl from '@lottiefiles/dotlottie-web/dotlottie-player.wasm?url';

export interface ConfettiAnimationProps {
  onComplete?: () => void;
  onError?: () => void;
}

export function resolvePublicAssetUrl(
  relativePath: string,
  baseUrl: string = import.meta.env.BASE_URL ?? '/'
): string {
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const normalizedPath = relativePath.startsWith('/') ? relativePath.slice(1) : relativePath;
  return `${normalizedBase}${normalizedPath}`;
}

export function ConfettiAnimation({ onComplete, onError }: ConfettiAnimationProps) {
  const [dotLottie, setDotLottie] = useState<DotLottie | null>(null);
  const onCompleteRef = useRef(onComplete);
  const onErrorRef = useRef(onError);
  onCompleteRef.current = onComplete;
  onErrorRef.current = onError;

  // Configure local self-hosted WASM before DotLottieReact constructs DotLottie, preventing CDN requests.
  const [wasmInitFailed] = useState<boolean>(() => {
    try {
      setWasmUrl(dotLottieWasmUrl);
      return false;
    } catch {
      return true;
    }
  });

  useEffect(() => {
    if (wasmInitFailed) {
      onErrorRef.current?.();
    }
  }, [wasmInitFailed]);

  useEffect(() => {
    if (!dotLottie) return;

    const handleComplete = () => {
      onCompleteRef.current?.();
    };

    const handleError = () => {
      onErrorRef.current?.();
    };

    dotLottie.addEventListener('complete', handleComplete);
    dotLottie.addEventListener('loadError', handleError);
    dotLottie.addEventListener('renderError', handleError);

    return () => {
      dotLottie.removeEventListener('complete', handleComplete);
      dotLottie.removeEventListener('loadError', handleError);
      dotLottie.removeEventListener('renderError', handleError);
    };
  }, [dotLottie]);

  if (wasmInitFailed) {
    return null;
  }

  const animationSrc = resolvePublicAssetUrl('animations/confetti.json');

  return (
    <div
      aria-hidden="true"
      data-testid="confetti-animation"
      className="w-full h-full pointer-events-none select-none"
    >
      <DotLottieReact
        src={animationSrc}
        autoplay
        loop={false}
        backgroundColor="transparent"
        layout={{ fit: 'cover', align: [0.5, 0.5] }}
        renderConfig={{ autoResize: true }}
        dotLottieRefCallback={setDotLottie}
        className="w-full h-full pointer-events-none"
        aria-hidden="true"
        tabIndex={-1}
      />
    </div>
  );
}

export default ConfettiAnimation;
