import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
  return (
    <>
      <div className="flex aspect-square size-9 items-center justify-center rounded-xl bg-gradient-to-br from-lime-300 to-green-500 text-zinc-900 shadow-[0_4px_12px_-2px_rgba(184,243,74,0.45)]">
        <AppLogoIcon className="size-5" />
      </div>
      <div className="ml-1 grid flex-1 text-left">
        <span className="text-base font-black leading-none tracking-tight">
          NoteFlow
        </span>
        <span className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
          Practice studio
        </span>
      </div>
    </>
  );
}
