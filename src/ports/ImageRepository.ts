import { AppErrorCode, ResultType } from '@/utils/types';

export interface ImageRepository {
  updateMainImageAtomic(imageId: string): Promise<ResultType<{ id: string }, AppErrorCode>>;
}
