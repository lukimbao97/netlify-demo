import "./App.css";
import {
  FieldDictionary,
  FilterBuilder,
  Filter,
  Input,
  Pagination,
  ResultsPerPage,
  SearchProvider,
  Sorting,
  Summary,
  Pipeline,
  RangeFilterBuilder,
} from "@sajari/react-search-ui";
import { useSearchContext } from "@sajari/react-hooks";
import { Image, Heading, Button } from "@sajari/react-components";
import { useState } from "react";

function App() {
  const key = "cartItem";
  const [item, setItem] = useState(() => {
    const existed = localStorage.getItem(key) ?? "[]";
    const parsed = JSON.parse(existed);
    return parsed;
  });

  const pipeline = new Pipeline(
    {
      account: "1594153711901724220",
      collection: "bestbuy",
    },
    "query"
  );

  const fields = new FieldDictionary({
    title: "name",
    subtitle: (data) =>
      data.level4 || data.level3 || data.level2 || data.level1 || data.brand,
  });

  const brandFilter = new FilterBuilder({
    name: "brand",
    field: "brand",
  });

  const categoryFilter = new FilterBuilder({
    name: "level1",
    field: "level1",
  });

  const colorFilter = new FilterBuilder({
    name: "color",
    field: "imageTags",
    array: true,
  });

  const priceFilter = new RangeFilterBuilder({
    name: "price",
    field: "price",
  });

  const ratingFilter = new FilterBuilder({
    name: "rating",
    field: "rating",
  });

  const addCart = (id: string, name: string) => {
    const existed = localStorage.getItem(key) ?? "[]";
    const parsed = JSON.parse(existed);
    const itemObj = { id: id, name: name };
    parsed.push(itemObj);
    setItem(parsed);
    localStorage.setItem(key, JSON.stringify(parsed));
  };

  const removeItem = (id: string) => {
    let hardItem: any = [...item];
    hardItem = hardItem.filter((hardItem: any) => hardItem.id !== id);
    localStorage.setItem(key, JSON.stringify(hardItem));
    setItem(hardItem);
  };

  const GetCart = () => {
    return (
      <div className="absolute z-10 hidden bg-white group-hover:block right-0">
        {item.map((item: any, index: any) => (
          <div key={index} className="flex flex-column w-max p-4 border-b-2">
            <div className="">{item.name}</div>
            <div className="ml-8">
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold p-2"
                onClick={() => removeItem(item.id)}
              >
                X
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const InnerApp = () => {
    const { searched, results } = useSearchContext();
    return (
      <div className="ml-10 mr-10">
        <div className="flex justify-end">
          <div className="relative group">
            <button className="flex flex-row items-center w-full px-4 py-4 mt-2 text-base font-bold text-left uppercase bg-transparent rounded-lg md:w-auto md:inline md:mt-0 md:ml-4 focus:outline-none font-montserrat">
              Cart
            </button>
            <GetCart />
          </div>
        </div>

        <Input />

        <div className="flex items-center justify-end mt-3">
          <Summary size="sm" />

          <div className="flex space-x-4 ml-auto">
            <Sorting
              type="select"
              options={[
                { name: "Most relevant", value: "" },
                { name: "Brand: A to Z", value: "brand" },
                { name: "Brand: Z to A", value: "-brand" },
                { name: "Rating: Low to High", value: "rating" },
                { name: "Rating: High to Low", value: "-rating" },
                { name: "Popularity", value: "popularity" },
              ]}
              size="sm"
            />
            <ResultsPerPage size="sm" />
          </div>
        </div>

        <div className="flex mt-6">
          <div className="w-1/4 pr-4 border-gray-100 border-r space-y-6">
            <Filter type="list" name="brand" title="Brand" searchable />
            <Filter type="list" name="level1" title="Category" searchable />
            <Filter type="range" name="price" title="Price" format="price" />
            <Filter type="color" name="color" title="Color" />
            <Filter type="rating" name="rating" title="Rating" />
          </div>

          <div className="flex-1 pl-4">
            {results?.map(
              ({ values: { _id, name, price, description, image } }) => (
                <div key={_id as string} className="flex flex-column m-4 pt-12">
                  <div className="flex justify-center w-60">
                    <Image src={image as string} objectFit="cover" />
                  </div>
                  <div className="mr-1 w-100">
                    <div className="flex flex-row">
                      <Heading as="h2">{name}</Heading>
                      <div className="ml-auto">${price}</div>
                    </div>
                    <div>{description}</div>
                  </div>
                  <div className="flex-shrink-0">
                    <Button
                      appearance="primary"
                      size="xs"
                      onClick={() => {
                        addCart(_id as string, name as string);
                      }}
                    >
                      Add to cart
                    </Button>
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        <div className="sticky bottom-0 p-6">
          <Pagination />
        </div>
      </div>
    );
  };

  return (
    <SearchProvider
      search={{
        pipeline,
        fields,
        filters: [
          categoryFilter,
          priceFilter,
          colorFilter,
          ratingFilter,
          brandFilter,
        ],
      }}
      searchOnLoad
    >
      <InnerApp />
    </SearchProvider>
  );
}

export default App;
