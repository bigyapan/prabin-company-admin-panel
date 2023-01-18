<?php


namespace App\Helpers;


use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Collection;

class CollectionHelper
{
    public static function getData($request, $model, $with = [])
    {
        $keyword = $request['search'];
        if ($request['search']) {
            $items = $model::with($with)->get();
            $items = self::paginate($items->filter(function ($item) use ($keyword) {
                return false !== stripos($item, $keyword);
            })->sortBy($request['sort'], 0, $request['sortDesc']), $request['perPage']);
        } else {
            $items = $model::with($with)->get();
            $items = self::paginate($items->sortBy($request['sort'], 0, $request['sortDesc'])->values(), $request['perPage']);
        }
        return $items;
    }

    public static function paginate(Collection $items, $perPage, $page = null, $options = [])
    {
        $page = $page ?: (Paginator::resolveCurrentPage() ?: 1);

        $items = $items instanceof Collection ? $items : Collection::make($items);

        $lap = new LengthAwarePaginator($items->forPage($page, $perPage), $items->count(), $perPage, $page, $options);

        return [
            'current_page' => $lap->currentPage(),
            'data' => $lap->values(),
            'first_page_url' => $lap->url(1),
            'from' => $lap->firstItem(),
            'last_page' => $lap->lastPage(),
            'last_page_url' => $lap->url($lap->lastPage()),
            'next_page_url' => $lap->nextPageUrl(),
            'per_page' => $lap->perPage(),
            'prev_page_url' => $lap->previousPageUrl(),
            'to' => $lap->lastItem(),
            'total' => $lap->total(),
        ];
    }
}
