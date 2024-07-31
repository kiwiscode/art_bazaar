import axios from "axios";
import Input from "./Input";
import { useContext, useEffect, useState } from "react";
import { CollectorContext } from "./CollectorContext";
import useWindowDimensions from "../../utils/useWindowDimensions";
import Button from "./Button";
// when working on local version
const API_URL = import.meta.env.VITE_APP_API_URL;
function SearchArtistInput({
  searchArtistInputPadding,
  searchArtistInputPlaceHolder,
  onQueryUpdate,
  onArtistsUpdate,
  withLabel,
  searchInputWithLabelClassName,
  searchInputWithLabelHtmlFor,
  searchInputWithLabelText,
  searchInputRef,
  setQueryToParent,
}) {
  const { getToken } = useContext(CollectorContext);
  const { width } = useWindowDimensions();
  const [artistsForBox, setArtistsForBox] = useState([]);
  const [query, setQuery] = useState("");

  const onChangeSetQuery = (e) => {
    if (setQueryToParent) {
      setQueryToParent(e.target.value);
    }
    setQuery(e.target.value);
  };
  const searchArtists = async () => {
    try {
      const response = await axios.get(`${API_URL}/artist?q=${query}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      setArtistsForBox(response.data);
      onArtistsUpdate(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (query?.length) {
      searchArtists();
      if (onQueryUpdate) {
        onQueryUpdate(true);
      }
    } else {
      onArtistsUpdate([]);
    }
  }, [query]);

  return (
    <div
      style={{
        padding: searchArtistInputPadding,
        position: "relative",
      }}
    >
      <Input
        inputRef={searchInputRef}
        className={withLabel && "styled-input-with-label unica-regular-font"}
        searchInputWithLabel={withLabel}
        searchInputWithLabelClassName={searchInputWithLabelClassName}
        searchInputWithLabelHtmlFor={searchInputWithLabelHtmlFor}
        searchInputWithLabelText={searchInputWithLabelText}
        placeholder={searchArtistInputPlaceHolder}
        width={"inherit"}
        wrapperWidth={"100%"}
        maxWidth={"100%"}
        minWidth={"fit-content"}
        maxHeight={"40px"}
        wrapperHeight={"100%"}
        wrapperMaxHeight={"50px"}
        height={"100dvh"}
        borderRadius={"3px"}
        icon={
          <svg
            className="dflex"
            width={18}
            height={18}
            viewBox="0 0 18 18"
            fill="rgb(112, 112, 112)"
          >
            <path d="M11.5001 3.00003C11.9597 3.00003 12.4148 3.09056 12.8395 3.26645C13.2641 3.44234 13.6499 3.70015 13.9749 4.02515C14.2999 4.35016 14.5577 4.736 14.7336 5.16063C14.9095 5.58527 15.0001 6.0404 15.0001 6.50003C15.0001 6.95965 14.9095 7.41478 14.7336 7.83942C14.5577 8.26406 14.2999 8.6499 13.9749 8.9749C13.6499 9.29991 13.2641 9.55771 12.8395 9.73361C12.4148 9.9095 11.9597 10 11.5001 10C10.5718 10 9.68156 9.63128 9.02519 8.9749C8.36881 8.31852 8.00006 7.42828 8.00006 6.50003C8.00006 5.57177 8.36881 4.68153 9.02519 4.02515C9.68156 3.36878 10.5718 3.00003 11.5001 3.00003ZM11.5001 2.00003C10.61 2.00003 9.74002 2.26395 8.99999 2.75841C8.25997 3.25288 7.6832 3.95568 7.3426 4.77795C7.00201 5.60022 6.91289 6.50502 7.08653 7.37793C7.26016 8.25085 7.68874 9.05267 8.31808 9.68201C8.94742 10.3113 9.74924 10.7399 10.6222 10.9136C11.4951 11.0872 12.3999 10.9981 13.2221 10.6575C14.0444 10.3169 14.7472 9.74011 15.2417 9.00009C15.7361 8.26007 16.0001 7.39004 16.0001 6.50003C16.0014 5.90871 15.8859 5.32295 15.6602 4.77639C15.4345 4.22983 15.1031 3.73323 14.685 3.31511C14.2669 2.89698 13.7703 2.56556 13.2237 2.33988C12.6771 2.1142 12.0914 1.99871 11.5001 2.00003ZM9.44206 9.52503L8.56206 8.64503L2.06006 15.06L2.94006 15.94L9.44206 9.52503Z"></path>
          </svg>
        }
        iconPositionRight={true}
        value={query}
        onChange={onChangeSetQuery}
      />
    </div>
  );
}

export default SearchArtistInput;
