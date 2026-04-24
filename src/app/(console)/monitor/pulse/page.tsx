export default function PulsePage() {
  return <iframe src={process.env.NEXT_PUBLIC_BACKEND_URL + '/pulse'} className="h-full" />;
}
