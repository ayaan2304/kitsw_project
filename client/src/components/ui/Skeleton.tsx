import clsx from 'clsx';

interface SkeletonProps {
  className?: string;
}

const Skeleton = ({ className }: SkeletonProps) => (
  <div className={clsx('animate-pulse rounded-lg bg-white/10', className)} />
);

export default Skeleton;

